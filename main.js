/* =============================================
   ECHOES OF ADVENTURES — Portfolio JS
   =============================================
   BILDER PFLEGEN
   ─────────────────────────────────────────────
   1. Originale liegen lokal (nicht im Repo), z.B. ~/Pictures/echoes-originals
   2. python3 tools/generate_images.py --src ~/Pictures/echoes-originals
      → erzeugt images/r/* und images/images-manifest.js
   3. In HERO_SLIDES / GALLERY unten nur den Dateinamen eintragen.
      Die Zuordnung zum Manifest läuft über den Slug des Dateinamens.
   4. Fehlt das Manifest, fällt die Seite auf images/<datei> zurück —
      dann ohne srcset, aber nicht kaputt.

   ALT-TEXTE
   ─────────────────────────────────────────────
   Optionale Felder altEN / altDE pro Galeriebild. Ohne sie wird das
   Destinations-Label als Alt-Text benutzt — das ist rechtlich zulässig,
   aber inhaltlich schwach (WCAG 1.1.1). Beschreibende Alt-Texte nachtragen.
   ============================================= */

/* ─────────────────────────────────────────────
   HERO SLIDES
   file        → Dateiname des Originals
   titleEN/DE  → dekoratives Label (Slides sind aria-hidden)
   Der 4:5-Zuschnitt für Mobile kommt aus tools/hero-crops.json.
───────────────────────────────────────────── */
const HERO_SLIDES = [
  { file: 'hero-bali.jpg',       titleEN: 'Bali',      titleDE: 'Bali' },
  { file: 'hero-bangkok.jpg',    titleEN: 'Thailand',  titleDE: 'Thailand' },
  { file: 'hero-galapagos.jpg',  titleEN: 'Galápagos', titleDE: 'Galápagos' },
  { file: 'hero-algarve.jpg',    titleEN: 'Portugal',  titleDE: 'Portugal' },
  { file: 'hero-copenhagen.jpg', titleEN: 'Denmark',   titleDE: 'Dänemark' },
];

/* ─────────────────────────────────────────────
   GALLERY
   file        → Dateiname des Originals
   titleEN/DE  → Label auf Hover + in der Lightbox
   format      → 'landscape' | 'portrait' | 'square'
                 Nur noch Fallback: liegt das Bild im Manifest, wird das
                 echte Seitenverhältnis benutzt (kein Beschnitt im Raster).
   categories  → 'landscape' | 'people' | 'urban' | 'animals'
   altEN/altDE → optional, beschreibender Alt-Text
───────────────────────────────────────────── */
const GALLERY = [
  { file: 'gallery-bali.jpg',            titleEN: 'Indonesia',     titleDE: 'Indonesien',   format: 'portrait',  categories: ['people'] },
  { file: 'gallery-rome.jpg',            titleEN: 'Italy',         titleDE: 'Italien',      format: 'landscape', categories: ['urban'] },
  { file: 'gallery-nyhavn.jpg',          titleEN: 'Copenhagen',    titleDE: 'Kopenhagen',   format: 'landscape', categories: ['urban'] },
  { file: 'gallery-thai-musician.jpg',   titleEN: 'Musician',      titleDE: 'Musiker',      format: 'portrait',  categories: ['people'] },
  { file: 'gallery-mexican woman.jpg',   titleEN: 'Mexican Woman', titleDE: 'Mexikanerin',  format: 'portrait',  categories: ['people'] },
  { file: 'gallery-volcano.jpg',         titleEN: 'Spain',         titleDE: 'Spanien',      format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-thai-market.jpg',     titleEN: 'Thailand',      titleDE: 'Thailand',     format: 'landscape', categories: ['people'] },
  { file: 'gallery-thai girl.jpg',       titleEN: 'Thailand',      titleDE: 'Thailand',     format: 'portrait',  categories: ['people'] },
  { file: 'gallery-chiang mai urban life.jpg', titleEN: 'Thailand', titleDE: 'Thailand',    format: 'landscape', categories: ['people'] },
  { file: 'gallery-chiang mai temple.jpg',     titleEN: 'Thailand', titleDE: 'Thailand',    format: 'portrait',  categories: ['urban'] },
  { file: 'gallery-boy with snake.jpg',  titleEN: 'Thailand',      titleDE: 'Thailand',     format: 'portrait',  categories: ['people'] },
  { file: 'gallery-bangkok old town.jpg', titleEN: 'Thailand',     titleDE: 'Thailand',     format: 'landscape', categories: ['urban'] },
  { file: 'gallery-bangkok old town meets skyline.jpg', titleEN: 'Thailand', titleDE: 'Thailand', format: 'landscape', categories: ['urban'] },
  { file: 'gallery-bangkok living.jpg',  titleEN: 'Thailand',      titleDE: 'Thailand',     format: 'landscape', categories: ['urban'] },
  { file: 'gallery-traditional thai.jpg', titleEN: 'Thailand',     titleDE: 'Thailand',     format: 'portrait',  categories: ['people'] },
  { file: 'gallery-mallorca-coast.jpg',  titleEN: 'Spain',         titleDE: 'Spanien',      format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-mallorca.jpg',        titleEN: 'Spain',         titleDE: 'Spanien',      format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-croatia cat.jpg',     titleEN: 'Croatia',       titleDE: 'Kroatien',     format: 'landscape', categories: ['animals'] },
  { file: 'gallery-croatia island.jpg',  titleEN: 'Croatia',       titleDE: 'Kroatien',     format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-croatia landscape.jpg', titleEN: 'Croatia',     titleDE: 'Kroatien',     format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-marrakesh blue man.jpg', titleEN: 'Morocco',    titleDE: 'Marokko',      format: 'portrait',  categories: ['people'] },
  { file: 'gallery-marrakesh red man.jpg',  titleEN: 'Morocco',    titleDE: 'Marokko',      format: 'portrait',  categories: ['people'] },
  { file: 'gallery-spanish backyard.jpg', titleEN: 'Spain',        titleDE: 'Spanien',      format: 'portrait',  categories: ['urban'] },
  { file: 'gallery-ronda spain.jpg',     titleEN: 'Spain',         titleDE: 'Spanien',      format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-morroco surf.jpg',    titleEN: 'Morocco',       titleDE: 'Marokko',      format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-superkilen1.jpg',     titleEN: 'Denmark',       titleDE: 'Dänemark',     format: 'portrait',  categories: ['urban'] },
  { file: 'gallery-superkilen2.jpg',     titleEN: 'Denmark',       titleDE: 'Dänemark',     format: 'portrait',  categories: ['urban'] },
  { file: 'gallery-thailand beach.jpg',  titleEN: 'Thailand',      titleDE: 'Thailand',     format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-mexico city.jpg',     titleEN: 'Mexico',        titleDE: 'Mexiko',       format: 'landscape', categories: ['landscape', 'people'] },
  { file: 'gallery-bali-waterfall.jpg',  titleEN: 'Bali',          titleDE: 'Bali',         format: 'portrait',  categories: ['landscape'] },
  { file: 'gallery-madeira sunrise.jpg', titleEN: 'Madeira',       titleDE: 'Madeira',      format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-monkey looking up.jpg', titleEN: 'Bali',        titleDE: 'Bali',         format: 'portrait',  categories: ['animals'] },
  { file: 'gallery-penguin on rock.jpg', titleEN: 'Galápagos',     titleDE: 'Galápagos',    format: 'portrait',  categories: ['animals'] },
  { file: 'gallery-lake.jpg',            titleEN: 'Germany',       titleDE: 'Deutschland',  format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-koenigssee.jpg',      titleEN: 'Germany',       titleDE: 'Deutschland',  format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-passo giau.jpg',      titleEN: 'Italy',         titleDE: 'Italien',      format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-church.jpg',          titleEN: 'Germany',       titleDE: 'Deutschland',  format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-Walchensee.jpg',      titleEN: 'Germany',       titleDE: 'Deutschland',  format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-alps.jpg',            titleEN: 'Austria',       titleDE: 'Österreich',   format: 'landscape', categories: ['landscape'] },
  { file: 'gallery-eibsee.jpg',          titleEN: 'Germany',       titleDE: 'Deutschland',  format: 'landscape', categories: ['landscape'] },
];

/* =============================================
   BILD-MANIFEST
   ============================================= */
const MANIFEST = window.IMAGE_MANIFEST || { dir: 'images/r', images: {} };
const MIME = { avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg' };

const GALLERY_SIZES = '(min-width: 1025px) 31vw, (min-width: 481px) 46vw, 92vw';
const HERO_SIZES    = '100vw';

/* Muss identisch zu slugify() in tools/generate_images.py sein */
function slugify(name) {
  return name.normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function idOf(item) {
  if (!item.__id) item.__id = item.id || slugify(item.file.replace(/\.[^.]+$/, ''));
  return item.__id;
}

function entryOf(item) {
  return MANIFEST.images[idOf(item)] || null;
}

function srcsetFor(slug, variant, widths, fmt) {
  return widths.map(w => `${MANIFEST.dir}/${slug}-${variant}-${w}.${fmt} ${w}w`).join(', ');
}

function addSource(pic, attrs) {
  const s = document.createElement('source');
  Object.entries(attrs).forEach(([k, v]) => { if (v) s.setAttribute(k, v); });
  pic.appendChild(s);
}

/**
 * Baut ein <picture> aus dem Manifest.
 * opts.tallBelow  → Breakpoint, unterhalb dessen der 4:5-Zuschnitt greift
 * opts.eager      → true = sofort laden (nur erstes Hero-Bild)
 */
function buildPicture(item, { alt = '', sizes = '100vw', className = '',
                              tallBelow = 0, eager = false } = {}) {
  const slug = idOf(item);
  const e = entryOf(item);
  const pic = document.createElement('picture');
  if (className) pic.className = className;

  const img = document.createElement('img');
  img.alt = alt;
  img.decoding = 'async';
  // Attribute statt IDL-Properties: fetchpriority ist nicht überall als Property gespiegelt
  if (eager) img.setAttribute('fetchpriority', 'high');
  else       img.setAttribute('loading', 'lazy');

  if (!e) {
    // Fallback ohne Manifest: Originaldatei direkt
    img.src = `images/${item.file}`;
    pic.appendChild(img);
    return pic;
  }

  // 1. Mobile: 4:5-Zuschnitt, alle Formate
  if (tallBelow && e.tall) {
    e.f.forEach(f => addSource(pic, {
      media: `(max-width: ${tallBelow}px)`,
      type: MIME[f],
      srcset: srcsetFor(slug, 'tall', e.tall, f),
      sizes,
    }));
  }

  // 2. Moderne Formate im Originalseitenverhältnis
  e.f.filter(f => f !== 'jpg').forEach(f => addSource(pic, {
    type: MIME[f],
    srcset: srcsetFor(slug, 'wide', e.wide, f),
    sizes,
  }));

  // 3. JPEG-Fallback am <img>
  const maxW = e.wide[e.wide.length - 1];
  img.setAttribute('srcset', srcsetFor(slug, 'wide', e.wide, 'jpg'));
  img.setAttribute('sizes', sizes);
  img.setAttribute('src', `${MANIFEST.dir}/${slug}-wide-${e.wide[Math.min(2, e.wide.length - 1)]}.jpg`);
  img.setAttribute('width', String(maxW));
  img.setAttribute('height', String(Math.round(maxW / e.ar)));

  pic.appendChild(img);
  return pic;
}

/* =============================================
   STATE
   ============================================= */
let currentLang  = localStorage.getItem('eoa-lang') || 'en';
let activeFilter = 'all';
let lbItems      = [...GALLERY];
let lbIndex      = 0;
let heroIndex    = 0;
let heroPaused   = false;
let heroTimer    = null;
let lbTrigger    = null;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =============================================
   LANGUAGE
   ============================================= */
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('eoa-lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'de' ? (el.dataset.de || el.dataset.en) : el.dataset.en;
  });
  document.querySelectorAll('[data-en-label]').forEach(el => {
    el.setAttribute('aria-label', lang === 'de'
      ? (el.dataset.deLabel || el.dataset.enLabel)
      : el.dataset.enLabel);
  });
  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    el.placeholder = lang === 'de'
      ? (el.dataset.dePlaceholder || el.dataset.enPlaceholder)
      : el.dataset.enPlaceholder;
  });

  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'de' ? 'EN' : 'DE';

  renderGallery();
}

function toggleLanguage() {
  applyLanguage(currentLang === 'en' ? 'de' : 'en');
}

/* =============================================
   HERO SLIDER
   ============================================= */
function buildHeroSlides() {
  const container = document.getElementById('hero-slides');
  if (!container) return;

  HERO_SLIDES.forEach((slide, i) => {
    const el = document.createElement('div');
    el.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
    const e = entryOf(slide);
    if (e) el.style.backgroundColor = e.c;
    container.appendChild(el);
  });

  hydrateSlide(0);
  buildHeroDots();
  startHeroTimer();
  startProgress();

  // Slide 2 erst nach dem Laden der Seite anfordern, Rest im Leerlauf
  window.addEventListener('load', () => {
    hydrateSlide(1);
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200));
    idle(() => HERO_SLIDES.forEach((_, i) => hydrateSlide(i)));
  }, { once: true });
}

function hydrateSlide(i) {
  const idx = ((i % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;
  const el = document.querySelectorAll('.hero-slide')[idx];
  if (!el || el.dataset.loaded) return;
  el.dataset.loaded = '1';
  el.appendChild(buildPicture(HERO_SLIDES[idx], {
    alt: '',
    sizes: HERO_SIZES,
    className: 'hero-media',
    tallBelow: 640,
    eager: idx === 0,
  }));
}

function buildHeroDots() {
  const wrap = document.getElementById('hero-dots');
  if (!wrap) return;
  wrap.innerHTML = '';
  HERO_SLIDES.forEach((slide, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
    btn.setAttribute('aria-label', `${currentLang === 'de' ? 'Bild' : 'Slide'} ${i + 1}: ${currentLang === 'de' ? slide.titleDE : slide.titleEN}`);
    btn.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', () => goToSlide(i));
    wrap.appendChild(btn);
  });
}

function goToSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');

  slides[heroIndex]?.classList.remove('is-active');
  dots[heroIndex]?.classList.remove('is-active');
  dots[heroIndex]?.setAttribute('aria-current', 'false');

  heroIndex = ((idx % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;

  hydrateSlide(heroIndex);
  hydrateSlide(heroIndex + 1);

  slides[heroIndex]?.classList.add('is-active');
  dots[heroIndex]?.classList.add('is-active');
  dots[heroIndex]?.setAttribute('aria-current', 'true');

  startProgress();
}

function startHeroTimer() {
  if (reduceMotion) return;          // kein Auto-Advance bei reduzierter Bewegung
  clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    if (!heroPaused && !document.hidden) goToSlide(heroIndex + 1);
  }, 5000);
}

function startProgress() {
  const bar = document.getElementById('hero-progress');
  if (!bar || reduceMotion) return;
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.style.transition = 'width 5s linear';
    bar.style.width = '100%';
  }));
}

/* =============================================
   GALLERY
   ============================================= */
function altFor(item) {
  const a = currentLang === 'de' ? item.altDE : item.altEN;
  return a || (currentLang === 'de' ? item.titleDE : item.titleEN);
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const visible = activeFilter === 'all'
    ? GALLERY
    : GALLERY.filter(item => item.categories.includes(activeFilter));

  lbItems = visible;
  grid.innerHTML = '';

  visible.forEach((item, i) => {
    const label = currentLang === 'de' ? item.titleDE : item.titleEN;
    const e = entryOf(item);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `gallery-item gallery-item--${item.format}`;
    btn.setAttribute('aria-label',
      `${currentLang === 'de' ? 'Vergrößern' : 'Enlarge'}: ${altFor(item)}`);
    btn.setAttribute('aria-haspopup', 'dialog');

    const media = buildPicture(item, {
      alt: '',                       // Button trägt bereits das Label
      sizes: GALLERY_SIZES,
      className: 'gallery-media',
    });
    if (e) {
      media.style.aspectRatio = String(e.ar);
      media.style.backgroundColor = e.c;
    }
    btn.appendChild(media);

    const hover = document.createElement('span');
    hover.className = 'gallery-hover';
    hover.setAttribute('aria-hidden', 'true');
    hover.innerHTML = '<span class="gallery-plus">+</span>';
    btn.appendChild(hover);

    const dest = document.createElement('span');
    dest.className = 'gallery-dest';
    dest.setAttribute('aria-hidden', 'true');
    dest.textContent = label;
    btn.appendChild(dest);

    btn.addEventListener('click', () => openLightbox(i, btn));
    grid.appendChild(btn);
  });

  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = currentLang === 'de'
      ? 'Noch keine Fotos in dieser Kategorie.'
      : 'No photos in this category yet.';
    grid.appendChild(empty);
  }
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const active = btn.dataset.filter === filter;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  renderGallery();
}

/* =============================================
   LIGHTBOX MIT ZOOM
   ============================================= */
const ZOOM_MAX  = 5;
const ZOOM_STEP = 1.6;

const zoom = { scale: 1, tx: 0, ty: 0, hi: false };
const pointers = new Map();
let pinchStart = null;
let panStart = null;

function lbEls() {
  return {
    root:    document.getElementById('lightbox'),
    stage:   document.getElementById('lb-stage'),
    img:     document.getElementById('lb-img'),
    caption: document.getElementById('lb-caption'),
    counter: document.getElementById('lb-counter'),
    live:    document.getElementById('lb-live'),
  };
}

function openLightbox(index, trigger) {
  const { root } = lbEls();
  if (!root) return;
  lbTrigger = trigger || document.activeElement;
  lbIndex = index;
  updateLightbox();
  root.classList.add('is-open');
  root.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  document.getElementById('lb-close')?.focus();
}

function closeLightbox() {
  const { root } = lbEls();
  if (!root) return;
  resetZoom(false);
  root.classList.remove('is-open');
  root.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
  lbTrigger?.focus();
  lbTrigger = null;
}

function lbNext() { lbIndex = (lbIndex + 1) % lbItems.length; updateLightbox(); }
function lbPrev() { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; updateLightbox(); }

function updateLightbox() {
  const item = lbItems[lbIndex];
  if (!item) return;
  const { img, caption, counter, live } = lbEls();
  const label = currentLang === 'de' ? item.titleDE : item.titleEN;
  const e = entryOf(item);

  resetZoom(false);

  img.removeAttribute('srcset');
  img.alt = altFor(item);

  if (e) {
    const slug = idOf(item);
    const fmt = e.f.includes('avif') ? 'avif' : (e.f.includes('webp') ? 'webp' : 'jpg');
    // Startquelle an Viewport und Pixeldichte koppeln — sonst zieht ein Handy
    // dieselbe Datei wie ein 4K-Monitor
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const need = Math.max(window.innerWidth, window.innerHeight * e.ar) * dpr;
    const pick = e.wide.find(w => w >= need) || e.wide[e.wide.length - 1];
    img.src = `${MANIFEST.dir}/${slug}-wide-${pick}.${fmt}`;
    img.dataset.hi = `${MANIFEST.dir}/${slug}-wide-${e.wide[e.wide.length - 1]}.${fmt}`;
    img.style.backgroundColor = e.c;
  } else {
    img.src = `images/${item.file}`;
    delete img.dataset.hi;
  }

  if (caption) caption.textContent = label;
  if (counter) counter.textContent = `${lbIndex + 1} / ${lbItems.length}`;
  if (live) live.textContent = `${label}, ${lbIndex + 1} ${currentLang === 'de' ? 'von' : 'of'} ${lbItems.length}`;
}

/* ── Zoom-Mechanik ──────────────────────────── */
function applyTransform(animate) {
  const { img } = lbEls();
  if (!img) return;
  img.style.transition = (animate && !reduceMotion) ? 'transform 0.22s ease-out' : 'none';
  img.style.transform = `translate3d(${zoom.tx}px, ${zoom.ty}px, 0) scale(${zoom.scale})`;
  img.classList.toggle('is-zoomed', zoom.scale > 1.001);
  const root = document.getElementById('lightbox');
  root?.classList.toggle('is-zoomed', zoom.scale > 1.001);
  document.getElementById('lb-zoom-out')?.toggleAttribute('disabled', zoom.scale <= 1.001);
}

function clampPan() {
  const { stage, img } = lbEls();
  if (!stage || !img) return;
  const sw = stage.clientWidth, sh = stage.clientHeight;
  const iw = img.clientWidth * zoom.scale, ih = img.clientHeight * zoom.scale;
  const maxX = Math.max(0, (iw - sw) / 2);
  const maxY = Math.max(0, (ih - sh) / 2);
  zoom.tx = Math.max(-maxX, Math.min(maxX, zoom.tx));
  zoom.ty = Math.max(-maxY, Math.min(maxY, zoom.ty));
}

function loadHiRes() {
  const { img } = lbEls();
  if (!img || zoom.hi || !img.dataset.hi) return;
  zoom.hi = true;
  const pre = new Image();
  pre.onload = () => { img.src = img.dataset.hi; };
  pre.src = img.dataset.hi;
}

function setZoom(next, originX, originY, animate = true) {
  const { stage } = lbEls();
  if (!stage) return;
  const prev = zoom.scale;
  next = Math.max(1, Math.min(ZOOM_MAX, next));
  if (Math.abs(next - prev) < 0.001) return;

  const rect = stage.getBoundingClientRect();
  const ox = (originX ?? rect.left + rect.width / 2) - rect.left - rect.width / 2;
  const oy = (originY ?? rect.top + rect.height / 2) - rect.top - rect.height / 2;

  // Punkt unter dem Finger/Cursor festhalten
  zoom.tx = ox - (ox - zoom.tx) * (next / prev);
  zoom.ty = oy - (oy - zoom.ty) * (next / prev);
  zoom.scale = next;

  if (zoom.scale === 1) { zoom.tx = 0; zoom.ty = 0; }
  clampPan();
  applyTransform(animate);
  if (zoom.scale > 1.2) loadHiRes();
}

function resetZoom(animate = true) {
  zoom.scale = 1; zoom.tx = 0; zoom.ty = 0; zoom.hi = false;
  applyTransform(animate);
}

function initZoom() {
  const { stage, img } = lbEls();
  if (!stage || !img) return;

  document.getElementById('lb-zoom-in')?.addEventListener('click',
    () => setZoom(zoom.scale * ZOOM_STEP));
  document.getElementById('lb-zoom-out')?.addEventListener('click',
    () => setZoom(zoom.scale / ZOOM_STEP));
  document.getElementById('lb-zoom-reset')?.addEventListener('click',
    () => resetZoom());

  // Doppelklick / Doppeltipp
  let lastTap = 0;
  stage.addEventListener('dblclick', e => {
    setZoom(zoom.scale > 1.001 ? 1 : 2.5, e.clientX, e.clientY);
  });
  stage.addEventListener('pointerup', e => {
    if (e.pointerType === 'mouse') return;
    const now = Date.now();
    if (now - lastTap < 300) setZoom(zoom.scale > 1.001 ? 1 : 2.5, e.clientX, e.clientY);
    lastTap = now;
  });

  // Trackpad-Pinch und Strg+Wheel
  stage.addEventListener('wheel', e => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(zoom.scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY, false);
  }, { passive: false });

  // Pinch + Pan
  stage.addEventListener('pointerdown', e => {
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: zoom.scale };
    } else if (zoom.scale > 1.001) {
      panStart = { x: e.clientX, y: e.clientY, tx: zoom.tx, ty: zoom.ty };
    }
  });

  stage.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinchStart) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      setZoom(pinchStart.scale * (dist / pinchStart.dist),
              (a.x + b.x) / 2, (a.y + b.y) / 2, false);
    } else if (panStart && zoom.scale > 1.001) {
      zoom.tx = panStart.tx + (e.clientX - panStart.x);
      zoom.ty = panStart.ty + (e.clientY - panStart.y);
      clampPan();
      applyTransform(false);
    }
  });

  const endPointer = e => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) panStart = null;
  };
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
}

/* ── Fokus im Dialog halten (WCAG 2.4.3 / 2.1.2) ── */
function trapFocus(e) {
  const root = document.getElementById('lightbox');
  if (!root?.classList.contains('is-open') || e.key !== 'Tab') return;
  const focusable = [...root.querySelectorAll('button:not([disabled])')];
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* =============================================
   TOUCH SWIPE
   ============================================= */
function addSwipe(el, onLeft, onRight, guard = () => true) {
  if (!el) return;
  let startX = null, startY = null;
  el.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { startX = null; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if (startX === null || !guard()) { startX = null; return; }
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? onLeft() : onRight();
    startX = null;
  }, { passive: true });
}

/* =============================================
   MOBILE NAV
   ============================================= */
function openMobileNav() {
  document.getElementById('mobile-nav').classList.add('is-open');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'true');
  document.body.classList.add('is-locked');
  document.getElementById('mobile-nav-close')?.focus();
}
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('is-open');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-locked');
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

  buildHeroSlides();
  renderGallery();
  applyLanguage(currentLang);

  document.getElementById('lang-toggle')?.addEventListener('click', toggleLanguage);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  // Lightbox
  document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lb-prev')?.addEventListener('click', lbPrev);
  document.getElementById('lb-next')?.addEventListener('click', lbNext);
  initZoom();

  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (zoom.scale > 1.001) return;   // im Zoom ist der Hintergrund die Panflaeche
    if (e.target.id === 'lightbox' || e.target.id === 'lb-stage') closeLightbox();
  });

  // Statische Bilder im Markup (About, Referenzen): <div data-img="about.jpg">
  document.querySelectorAll('[data-img]').forEach(el => {
    el.appendChild(buildPicture({ file: el.dataset.img }, {
      alt: el.dataset.alt || '',
      sizes: el.dataset.sizes || '100vw',
      className: 'static-media',
    }));
  });

  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb?.classList.contains('is-open')) return;
    trapFocus(e);
    if (e.key === 'Escape') { zoom.scale > 1.001 ? resetZoom() : closeLightbox(); }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom(zoom.scale * ZOOM_STEP); }
    if (e.key === '-')                  { e.preventDefault(); setZoom(zoom.scale / ZOOM_STEP); }
    if (e.key === '0')                  { e.preventDefault(); resetZoom(); }

    const pan = 60;
    if (zoom.scale > 1.001) {
      const moves = { ArrowLeft: [pan, 0], ArrowRight: [-pan, 0],
                      ArrowUp: [0, pan],  ArrowDown: [0, -pan] };
      if (moves[e.key]) {
        e.preventDefault();
        zoom.tx += moves[e.key][0]; zoom.ty += moves[e.key][1];
        clampPan(); applyTransform(true);
      }
    } else {
      if (e.key === 'ArrowRight') lbNext();
      if (e.key === 'ArrowLeft')  lbPrev();
    }
  });

  addSwipe(document.getElementById('hero'),
    () => goToSlide(heroIndex + 1),
    () => goToSlide(heroIndex - 1));

  addSwipe(document.getElementById('lb-stage'),
    lbNext, lbPrev,
    () => zoom.scale <= 1.001);       // im Zoom wird gepannt, nicht geblättert

  const hero = document.getElementById('hero');
  hero?.addEventListener('mouseenter', () => { heroPaused = true; });
  hero?.addEventListener('mouseleave', () => { heroPaused = false; });
  hero?.addEventListener('focusin',    () => { heroPaused = true; });
  hero?.addEventListener('focusout',   () => { heroPaused = false; });

  document.getElementById('hamburger')?.addEventListener('click', openMobileNav);
  document.getElementById('mobile-nav-close')?.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-nav-link').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  const nav = document.querySelector('.nav');
  const onScroll = () => nav?.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  document.getElementById('hero-prev')?.addEventListener('click', () => goToSlide(heroIndex - 1));
  document.getElementById('hero-next')?.addEventListener('click', () => goToSlide(heroIndex + 1));

});
