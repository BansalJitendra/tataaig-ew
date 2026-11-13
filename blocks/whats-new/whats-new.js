/**
 * whats-new — "Whats New" notice carousel: two cards per view with a next arrow (desktop),
 * one card per view with dots (mobile). Schema: stardust/eds-schema/index.json § news.
 * Decode tier: reconstructive (repeat group).
 *
 * Authoring: section heading as default content before the block (reabsorbed, EW8).
 * Rows, one per notice: icon image | notice paragraph(s) (may be empty) | "Read More"
 * paragraph (the control that expands the clamped notice).
 * The source ships two carousels swapped by width; the desktop one holds the authored nodes,
 * the mobile one is a presentational clone (EW4, instrumentation stripped).
 */

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(node);
  return w;
}
const pic = (n) => (n ? (n.matches('picture, img') && n) || n.querySelector('picture, img') : null);
const media = (n) => {
  const m = pic(n);
  return m ? m.closest('picture') || m : null;
};
const hasText = (n) => !!n && n.textContent.replace(/\s+/g, '').length > 0;

function absorbHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const head = document.createElement('div');
  head.className = 'news-title';
  head.append(...prev.childNodes);
  prev.remove();
  return head;
}

function wireRead(slide) {
  const ctl = slide.querySelector('.news-read');
  const desc = slide.querySelector('.news-desc');
  if (!ctl || !desc) return;
  const toggle = () => {
    const open = desc.classList.toggle('is-open');
    ctl.setAttribute('aria-expanded', String(open));
  };
  ctl.addEventListener('click', toggle);
  ctl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
}

function buildSlide(row) {
  const cells = [...row.children];
  const slide = document.createElement('li');
  slide.className = 'news-slide';
  const card = document.createElement('div');
  card.className = 'news-card';
  const m = media(row);
  if (m) card.append(wrapNode(m, 'news-icon'));
  const text = document.createElement('div');
  text.className = 'news-text';
  const desc = document.createElement('div');
  desc.className = 'news-desc';
  let ps = [...row.querySelectorAll('p')].filter((p) => hasText(p) && !pic(p));
  let read = null;
  if (cells.length >= 3) {
    const last = cells[cells.length - 1];
    read = ps.find((p) => last.contains(p)) || null;
  } else if (ps.length > 1) read = ps[ps.length - 1];
  ps = ps.filter((p) => p !== read);
  desc.append(...ps);
  text.append(desc);
  if (read) {
    const ctl = wrapNode(read, 'news-read');
    ctl.setAttribute('role', 'button');
    ctl.setAttribute('tabindex', '0');
    ctl.setAttribute('aria-expanded', 'false');
    text.append(ctl);
  }
  card.append(text);
  slide.append(card);
  wireRead(slide);
  return slide;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

function carousel(className, slides) {
  const box = document.createElement('div');
  box.className = className;
  const viewport = document.createElement('div');
  viewport.className = 'news-viewport';
  const track = document.createElement('ul');
  track.className = 'news-track';
  track.append(...slides);
  viewport.append(track);
  box.append(viewport);
  let i = 0;
  const go = (n) => {
    i = n;
    const w = slides[0] ? slides[0].getBoundingClientRect().width : 0;
    track.style.transform = i ? `translateX(${-i * w}px)` : '';
    box.querySelectorAll('.news-dots li').forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  return {
    box, viewport, slides, go, index: () => i,
  };
}

export default function decorate(block) {
  const head = absorbHead(block);
  const slides = [];
  [...block.children].forEach((row) => {
    if (hasText(row) || pic(row)) slides.push(buildSlide(row));
  });

  // desktop: the authored slides, two per view, next arrow
  const d = carousel('news-d only-d', slides);
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'news-next';
  next.setAttribute('aria-label', 'Next slide');
  const arrow = document.createElement('img');
  arrow.src = '/icons/iconRight.png';
  arrow.alt = '';
  next.append(arrow);
  next.addEventListener('click', () => {
    if (!slides.length) return;
    const w = slides[0].getBoundingClientRect().width;
    const visible = Math.max(1, Math.round(d.viewport.getBoundingClientRect().width / w));
    const i = d.index();
    d.go((i + 1) > slides.length - visible ? 0 : i + 1);
  });
  d.box.append(next);

  // mobile: the source's second carousel — a presentational clone (EW4), one per view, dots
  const clones = slides.map((s) => {
    const c = stripInstrumentation(s.cloneNode(true));
    wireRead(c);
    return c;
  });
  const m = carousel('news-m only-m', clones);
  const dots = document.createElement('ul');
  dots.className = 'news-dots';
  clones.forEach((s, n) => {
    const li = document.createElement('li');
    if (n === 0) li.classList.add('is-active');
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', String(n + 1));
    b.addEventListener('click', () => m.go(n));
    li.append(b);
    dots.append(li);
  });
  m.box.append(dots);

  block.replaceChildren();
  if (head) block.append(head);
  block.append(d.box, m.box);
  block.querySelectorAll('.news-icon img').forEach((img) => {
    img.loading = 'eager';
  });
}
