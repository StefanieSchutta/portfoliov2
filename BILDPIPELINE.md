# Bild-Pipeline — Echoes of Adventures

Ablauf in vier Schritten. Schritt 1 und 2 machst du einmal, Schritt 3 bei jedem
neuen Bild, Schritt 4 nur, wenn ein Hero-Bild dazukommt oder getauscht wird.

---

## 0. Voraussetzungen

```bash
pip install --upgrade Pillow      # ab 11.3 mit AVIF-Support
```

Prüfen, ob AVIF vorhanden ist:

```bash
python3 -c "from PIL import features; print(features.check('avif'))"
```

`False` ist kein Blocker — das Skript baut dann nur WebP und JPEG. Die Seite
funktioniert, die Dateien sind nur etwa 25 % größer.

**Originale gehören nicht ins Repo.** Leg sie lokal ab, z. B.
`~/Pictures/echoes-originals/`. Ins Repo kommen nur `images/r/` und
`images/images-manifest.js`. Bisher liegen die Vollauflösungen mit im
Repository — die kannst du nach dem ersten Lauf entfernen.

---

## 1. Hero-Zuschnitte festlegen

`tools/hero-crop-tool.html` im Browser öffnen (Doppelklick reicht, läuft
komplett lokal), die fünf Hero-Originale auswählen, pro Bild den 4:5-Rahmen
setzen. Ergebnis als `tools/hero-crops.json` speichern.

Ohne diese Datei beschneidet das Skript mittig. Für Motive, die nicht in der
Bildmitte sitzen, ist das falsch — genau das ist der Grund für den ganzen
Umbau.

Bedienung: Rahmen ziehen, Regler für die Größe, Pfeiltasten für feine
Korrekturen (mit Shift größere Schritte), `+`/`−` für die Größe.

---

## 2. Varianten erzeugen

```bash
python3 tools/generate_images.py --src ~/Pictures/echoes-originals
```

Das erzeugt:

```
images/r/<slug>-wide-<breite>.avif|webp|jpg     Originalformat, 480–2560 px
images/r/<slug>-tall-<breite>.avif|webp|jpg     4:5, 400–1440 px, nur hero-*
images/images-manifest.js                        wird von main.js eingelesen
```

Nützliche Schalter:

| Schalter | Wirkung |
|---|---|
| `--only hero-bali gallery-alps` | nur diese Slugs neu bauen |
| `--force` | vorhandene Dateien überschreiben (sonst wird übersprungen) |
| `--no-avif` | AVIF auslassen |
| `--out`, `--manifest`, `--crops` | Pfade überschreiben |

Zweite Läufe sind schnell, weil bestehende Dateien übersprungen werden. Ein
`--only`-Lauf löscht keine Manifest-Einträge anderer Bilder.

---

## 3. Neues Bild aufnehmen

1. Original in den Quellordner legen
2. `python3 tools/generate_images.py --src ...` laufen lassen
3. In `main.js` einen Eintrag in `GALLERY` ergänzen — nur `file`, `titleEN/DE`,
   `format`, `categories`
4. `images/r/` und `images/images-manifest.js` committen

Die Verbindung zwischen `file` und den generierten Dateien läuft über den
Slug des Dateinamens. `gallery-Walchensee.jpg` wird zu `gallery-walchensee`.
Die Slug-Regel ist in `generate_images.py`, `main.js` und im Crop-Tool
identisch implementiert — wenn du sie änderst, an allen drei Stellen.

**Dateinamen mit Leerzeichen** funktionieren, weil sie im Slug verschwinden.
In `srcset` wären sie syntaktisch ungültig — deshalb greift die Seite nur ohne
Manifest auf den Originalnamen zurück, und dann ohne `srcset`.

---

## 4. Hero-Bild tauschen

1. Neues Original ablegen, altes entfernen
2. Crop-Tool erneut öffnen, alle Hero-Bilder laden, `hero-crops.json`
   neu speichern (die Datei wird komplett ersetzt, nicht ergänzt)
3. `python3 tools/generate_images.py --src ... --force`
4. `HERO_SLIDES` in `main.js` anpassen

---

## Was sich im Code geändert hat

**Von `background-image` auf `<picture>`.** Vorher waren Hero, Galerie,
Lightbox und About CSS-Hintergrundbilder. Damit ist `srcset` technisch nicht
möglich, `loading="lazy"` auch nicht — alle rund 40 Galeriebilder wurden beim
Seitenaufruf in voller Auflösung geladen. Jetzt lädt die Galerie verzögert und
in der Breite, die der Viewport tatsächlich braucht.

**Hero mobil.** Unter 640 px Viewportbreite liefert `<picture>` den
4:5-Zuschnitt aus, und der Hero ist nicht mehr 85 vh hoch, sondern hat das
Seitenverhältnis 4:5. Der Breakpoint steht an zwei Stellen und muss
übereinstimmen: `tallBelow: 640` in `main.js` und die Media-Query in
`style.css`.

**Galerie ohne Zwangsbeschnitt.** Liegt ein Manifest-Eintrag vor, bekommt die
Kachel das echte Seitenverhältnis des Bildes statt fix 4:3 bzw. 3:4. Das Feld
`format` bleibt als Fallback drin.

**Lightbox mit Zoom.** Pinch, Doppeltipp, Mausrad mit Strg, Buttons und die
Tasten `+`, `−`, `0`. Im Zoom wird gepannt (Ziehen, Pfeiltasten), außerhalb
geblättert. Ab Zoomfaktor 1,2 wird die größte Variante nachgeladen. `Esc`
setzt erst den Zoom zurück, beim zweiten Druck schließt es.

**Barrierefreiheit.** Fokus wird im Dialog gehalten und beim Schließen an die
auslösende Kachel zurückgegeben. Die Gestensteuerung hat durchgehend eine
Ein-Finger- bzw. Tastatur-Alternative (WCAG 2.5.1). Galeriekacheln sind echte
`<button>`-Elemente statt `div[role=button]`. Hero-Dots haben 24 px
Trefferfläche. Bei `prefers-reduced-motion` läuft der Slider nicht mehr
automatisch weiter.

**Nebenbei behoben:** `impressum.html` und `datenschutz.html` verwiesen auf
`css/style.css` statt `style.css` — beide Seiten waren ungestylt. Die
Fortschrittsleiste des Sliders (`#hero-progress`) wurde von `main.js` gesucht,
existierte im Markup aber nicht.

---

## Offener Punkt: Alt-Texte

Aktuell ist der Alt-Text eines Galeriebildes das Destinations-Label
("Thailand"). Das erfüllt WCAG 1.1.1 formal, hilft aber weder Screenreadern
noch der Bildersuche. `main.js` unterstützt optionale Felder `altEN` / `altDE`
pro Bild:

```js
{ file: 'gallery-boy with snake.jpg', titleEN: 'Thailand', titleDE: 'Thailand',
  altEN: 'Boy holding a python at a roadside stall near Chiang Mai',
  altDE: 'Junge mit einer Python an einem Straßenstand bei Chiang Mai',
  format: 'portrait', categories: ['people'] },
```

Vierzig beschreibende Alt-Texte sind Handarbeit — die kann ich nicht erfinden,
ohne zu raten, was auf den Bildern zu sehen ist.
