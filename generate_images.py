#!/usr/bin/env python3
"""
Echoes of Adventures — Bild-Pipeline
====================================
Erzeugt aus den Originalen responsive Varianten (AVIF / WebP / JPEG) in mehreren
Breiten plus ein Manifest, das main.js einliest. Kein Build-Step zur Laufzeit.

Aufruf
------
    python3 tools/generate_images.py --src ~/Pictures/echoes-originals

    # nur ein paar Bilder neu bauen
    python3 tools/generate_images.py --src ... --only hero-bali hero-algarve --force

Ausgabe
-------
    images/r/<slug>-<variante>-<breite>.<avif|webp|jpg>
    images/images-manifest.js

Varianten
---------
    wide  Originalseitenverhaeltnis (Desktop-Hero, Galerie, Lightbox)
    tall  4:5-Zuschnitt (nur Hero, nur mobil ausgespielt)

Der 4:5-Zuschnitt kommt aus tools/hero-crops.json, wenn dort ein Eintrag fuer
den Slug existiert. Ohne Eintrag wird mittig beschnitten — bei Motiven ausserhalb
der Bildmitte ist das falsch, dafuer gibt es tools/hero-crop-tool.html.

Abhaengigkeit: Pillow >= 11.3 (AVIF-Support).  pip install --upgrade Pillow
Fehlt AVIF, laeuft das Skript trotzdem durch und schreibt nur WebP + JPEG.
"""

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

try:
    from PIL import Image, ImageCms, ImageOps, features
except ImportError:
    sys.exit("Pillow fehlt.  pip install --upgrade Pillow")

Image.MAX_IMAGE_PIXELS = None

# ── Konfiguration ────────────────────────────────────────────────────────────

SOURCE_EXT = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}

# Breiten, in denen ausgeliefert wird. Breiten oberhalb der Originalbreite
# werden uebersprungen (kein Hochskalieren).
WIDTHS_WIDE = [480, 768, 1024, 1440, 1920, 2560]
WIDTHS_TALL = [400, 640, 828, 1080, 1440]

TALL_RATIO = 4 / 5  # Breite / Hoehe

QUALITY = {"avif": 52, "webp": 78, "jpg": 82}

# Dateien, die nie verarbeitet werden (Favicons, Grafiken)
SKIP_PATTERNS = ("favicon", "og-", "logo")

# Slugs, fuer die zusaetzlich der 4:5-Zuschnitt gebaut wird.
# Standard: alles, was mit "hero-" beginnt.
def wants_tall(slug: str) -> bool:
    return slug.startswith("hero-")


# ── Hilfsfunktionen ──────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    """Muss identisch zur JS-Version in hero-crop-tool.html und main.js sein."""
    s = unicodedata.normalize("NFKD", name)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.replace("ß", "ss").lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-{2,}", "-", s).strip("-")


SRGB = ImageCms.createProfile("sRGB")


def load_srgb(path: Path) -> Image.Image:
    """Oeffnet ein Bild, korrigiert die EXIF-Rotation und konvertiert nach sRGB."""
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)

    icc = im.info.get("icc_profile")
    if icc:
        try:
            from io import BytesIO
            src = ImageCms.getOpenProfile(BytesIO(icc))
            im = ImageCms.profileToProfile(im, src, SRGB, outputMode="RGB")
        except Exception:
            im = im.convert("RGB")
    else:
        im = im.convert("RGB")
    return im


def average_color(im: Image.Image) -> str:
    """Mittlere Farbe als Platzhalter, bis das Bild geladen ist."""
    small = im.resize((1, 1), Image.Resampling.BOX)
    r, g, b = small.getpixel((0, 0))[:3]
    return f"#{r:02X}{g:02X}{b:02X}"


def crop_tall(im: Image.Image, rect: dict | None) -> Image.Image:
    """4:5-Ausschnitt. rect = normalisierte Koordinaten aus dem Crop-Tool."""
    W, H = im.size
    if rect:
        x = int(round(rect["x"] * W))
        y = int(round(rect["y"] * H))
        w = int(round(rect["w"] * W))
        h = int(round(rect["h"] * H))
        # Auf gueltige Grenzen und exaktes 4:5 nachziehen
        w = max(16, min(w, W))
        h = max(16, min(h, H))
        if abs((w / h) - TALL_RATIO) > 0.01:
            h = int(round(w / TALL_RATIO))
        x = max(0, min(x, W - w))
        y = max(0, min(y, H - h))
        if y + h > H:
            h = H - y
            w = int(round(h * TALL_RATIO))
        return im.crop((x, y, x + w, y + h))

    # Fallback: mittig, so gross wie moeglich
    if W / H > TALL_RATIO:
        h = H
        w = int(round(h * TALL_RATIO))
    else:
        w = W
        h = int(round(w / TALL_RATIO))
    x = (W - w) // 2
    y = (H - h) // 2
    return im.crop((x, y, x + w, y + h))


def encode(im: Image.Image, out: Path, fmt: str, force: bool) -> None:
    if out.exists() and not force:
        return
    out.parent.mkdir(parents=True, exist_ok=True)
    if fmt == "avif":
        im.save(out, "AVIF", quality=QUALITY["avif"], speed=5)
    elif fmt == "webp":
        im.save(out, "WEBP", quality=QUALITY["webp"], method=5)
    else:
        im.save(out, "JPEG", quality=QUALITY["jpg"], optimize=True, progressive=True)


def build_variant(im: Image.Image, slug: str, variant: str, widths: list[int],
                  formats: list[str], out_dir: Path, force: bool) -> list[int]:
    """Skaliert und kodiert eine Variante. Gibt die tatsaechlich gebauten Breiten zurueck."""
    src_w, src_h = im.size
    targets = [w for w in widths if w <= src_w]
    if not targets:
        targets = [src_w]          # Original kleiner als die kleinste Zielbreite
    if src_w not in targets and src_w < max(widths):
        targets.append(src_w)      # Originalbreite als groesste Stufe mitnehmen
    targets = sorted(set(targets))

    for w in targets:
        h = max(1, int(round(w * src_h / src_w)))
        resized = im if (w, h) == (src_w, src_h) else im.resize((w, h), Image.Resampling.LANCZOS)
        for fmt in formats:
            encode(resized, out_dir / f"{slug}-{variant}-{w}.{fmt}", fmt, force)
    return targets


# ── Hauptlauf ────────────────────────────────────────────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(description="Responsive Bildvarianten + Manifest erzeugen")
    ap.add_argument("--src", required=True, help="Ordner mit den Originalen")
    ap.add_argument("--out", default="images/r", help="Ausgabeordner (Default: images/r)")
    ap.add_argument("--manifest", default="images/images-manifest.js",
                    help="Pfad des Manifests (Default: images/images-manifest.js)")
    ap.add_argument("--crops", default="tools/hero-crops.json",
                    help="4:5-Zuschnitte aus dem Crop-Tool")
    ap.add_argument("--only", nargs="*", default=None, help="Nur diese Slugs bauen")
    ap.add_argument("--force", action="store_true", help="Vorhandene Dateien ueberschreiben")
    ap.add_argument("--no-avif", action="store_true", help="AVIF ueberspringen")
    args = ap.parse_args()

    src_dir = Path(args.src).expanduser()
    if not src_dir.is_dir():
        sys.exit(f"Quellordner nicht gefunden: {src_dir}")

    out_dir = Path(args.out)
    manifest_path = Path(args.manifest)

    formats = ["webp", "jpg"]
    if not args.no_avif and features.check("avif"):
        formats.insert(0, "avif")
    else:
        print("Hinweis: kein AVIF-Support in dieser Pillow-Version — nur WebP + JPEG.")

    crops = {}
    crops_path = Path(args.crops)
    if crops_path.exists():
        crops = json.loads(crops_path.read_text(encoding="utf-8"))
        print(f"{len(crops)} Hero-Zuschnitte aus {crops_path} geladen.")
    else:
        print(f"Kein {crops_path} — Hero-Bilder werden mittig auf 4:5 beschnitten.")

    files = sorted(p for p in src_dir.iterdir()
                   if p.is_file()
                   and p.suffix.lower() in SOURCE_EXT
                   and not any(pat in p.stem.lower() for pat in SKIP_PATTERNS))
    if not files:
        sys.exit(f"Keine Bilder in {src_dir} gefunden.")

    # Bestehendes Manifest einlesen, damit --only nichts loescht
    manifest: dict[str, dict] = {}
    if manifest_path.exists():
        raw = manifest_path.read_text(encoding="utf-8")
        m = re.search(r"=\s*(\{.*\});?\s*$", raw, re.S)
        if m:
            try:
                manifest = json.loads(m.group(1)).get("images", {})
            except json.JSONDecodeError:
                pass

    seen: dict[str, Path] = {}
    built = 0

    for path in files:
        slug = slugify(path.stem)
        if slug in seen:
            print(f"  ! Slug-Kollision: {path.name} und {seen[slug].name} → beide werden "
                  f"'{slug}'. Eine der Dateien umbenennen.")
            continue
        seen[slug] = path

        if args.only and slug not in args.only:
            continue

        im = load_srgb(path)
        W, H = im.size

        entry: dict = {
            "ar": round(W / H, 4),
            "c": average_color(im),
            "f": formats,
            "src": path.name,
        }
        entry["wide"] = build_variant(im, slug, "wide", WIDTHS_WIDE, formats, out_dir, args.force)

        if wants_tall(slug):
            tall = crop_tall(im, crops.get(slug))
            entry["tall"] = build_variant(tall, slug, "tall", WIDTHS_TALL, formats,
                                          out_dir, args.force)
            entry["tallAr"] = round(TALL_RATIO, 4)
            mark = "Crop-Tool" if slug in crops else "mittig"
            print(f"  {slug:38s} {W}×{H}  wide+tall ({mark})")
        else:
            print(f"  {slug:38s} {W}×{H}  wide")

        manifest[slug] = entry
        built += 1
        im.close()

    payload = {
        "widths": {"wide": WIDTHS_WIDE, "tall": WIDTHS_TALL},
        "dir": str(out_dir).replace("\\", "/"),
        "images": dict(sorted(manifest.items())),
    }
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        "/* Automatisch erzeugt von tools/generate_images.py — nicht von Hand editieren. */\n"
        "window.IMAGE_MANIFEST = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":")).replace('},"', '},\n  "')
        + ";\n",
        encoding="utf-8",
    )

    total = sum(1 for _ in out_dir.glob("*")) if out_dir.exists() else 0
    size_mb = sum(p.stat().st_size for p in out_dir.glob("*")) / 1e6 if out_dir.exists() else 0
    print(f"\n{built} Bild(er) verarbeitet.")
    print(f"{total} Dateien in {out_dir} ({size_mb:.1f} MB)")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
