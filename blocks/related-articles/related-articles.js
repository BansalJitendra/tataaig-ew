/**
 * related-articles — "Related Articles": three article cards (desktop row; mobile centred
 * slider with dots). Schema: stardust/eds-schema/index.json § art.
 * Decode tier: reconstructive (repeat group); card-as-link (EW6).
 *
 * Authoring: section heading as default content before the block (reabsorbed, EW8).
 * Rows, one per article: image | title heading holding the article link + teaser paragraph.
 * Mobile shows a presentational paragraph clone of the title (the source swaps a heading for
 * text at its mobile step; EW4 — the heading stays the editable node).
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

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

function absorbHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const head = document.createElement('div');
  head.className = 'art-heading';
  head.append(...prev.childNodes);
  prev.remove();
  return head;
}

function buildCard(row) {
  const col = document.createElement('li');
  col.className = 'art-col';
  const link = row.querySelector('a[href]');
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'art-card';
  let linkPar = null;
  if (link) {
    card.href = link.href;
    linkPar = link.closest('p');
    link.replaceWith(...link.childNodes); // EW6: the card is the link, the authored text stays
  }
  const m = media(row);
  if (m) card.append(wrapNode(m, 'art-media'));
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    card.append(wrapNode(heading, 'art-title only-d'));
    // the source's mobile card renders the title as text, not a heading: a presentational
    // paragraph clone (EW4) shown at the mobile step
    const p = document.createElement('p');
    p.append(...stripInstrumentation(heading.cloneNode(true)).childNodes);
    card.append(wrapNode(p, 'art-title only-m'));
  }
  [...row.querySelectorAll('p')].filter((p) => hasText(p) && !pic(p))
    .forEach((p) => card.append(wrapNode(p, 'art-desc')));
  if (linkPar && !card.contains(linkPar) && hasText(linkPar)) card.append(wrapNode(linkPar, 'art-desc'));
  col.append(card);
  return col;
}

export default function decorate(block) {
  const head = absorbHead(block);
  const inner = document.createElement('div');
  inner.className = 'art-inner';
  if (head) inner.append(head);
  const slider = document.createElement('div');
  slider.className = 'art-slider';
  const viewport = document.createElement('div');
  viewport.className = 'art-viewport';
  const track = document.createElement('ul');
  track.className = 'art-track';
  [...block.children].forEach((row) => {
    if (hasText(row) || pic(row)) track.append(buildCard(row));
  });
  viewport.append(track);

  const dots = document.createElement('ul');
  dots.className = 'art-dots only-m';
  const cols = [...track.children];
  const mq = window.matchMedia('(width <= 768px)');
  const go = (n) => {
    [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === n));
    const w = cols[0] ? cols[0].getBoundingClientRect().width : 0;
    track.style.transform = mq.matches && n > 0 ? `translateX(${30 - n * w}px)` : '';
  };
  cols.forEach((c, n) => {
    const li = document.createElement('li');
    if (n === 0) li.classList.add('is-active');
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', String(n + 1));
    b.addEventListener('click', () => go(n));
    li.append(b);
    dots.append(li);
  });
  mq.addEventListener('change', () => go(0));

  slider.append(viewport, dots);
  inner.append(slider);
  block.replaceChildren(inner);
}
