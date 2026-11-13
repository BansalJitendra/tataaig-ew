/**
 * why-tata — "Why TATA AIG" arc of six proof points (desktop) / two-column grid (mobile).
 * Schema: stardust/eds-schema/index.json § why. Decode tier: reconstructive (repeat group).
 *
 * Authoring: section heading as default content before the block (reabsorbed, EW8).
 * Rows:
 *   item rows (2 cells) — icon image | label paragraph + link paragraph. A link to a
 *     placeholder target (href ending "!#", as on the source) renders as an
 *     accessible-name-only anchor (the source's empty "Learn more" anchors).
 *   art row (1 cell, image only) — the mobile illustration under the grid.
 * The source swaps two DOMs by width (desktop arc, mobile grid); the arc holds the authored
 * nodes, the mobile grid is a presentational clone (EW4, instrumentation stripped).
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

function mobileGrid(list) {
  const grid = document.createElement('ul');
  grid.className = 'why-m-grid';
  [...list.children].forEach((li) => {
    const item = document.createElement('li');
    item.className = 'why-m-item';
    const circle = li.querySelector('.why-circle');
    if (circle) item.append(stripInstrumentation(circle.cloneNode(true)));
    const text = document.createElement('div');
    text.className = 'why-m-text';
    const label = li.querySelector('.why-label');
    if (label) {
      [...label.children].forEach((c) => text.append(stripInstrumentation(c.cloneNode(true))));
    }
    item.append(text);
    grid.append(item);
  });
  return grid;
}

function absorbHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const head = document.createElement('div');
  head.className = 'why-title';
  head.append(...prev.childNodes);
  prev.remove();
  return head;
}

export default function decorate(block) {
  const head = absorbHead(block);
  const arc = document.createElement('div');
  arc.className = 'why-arc only-d';
  const ring = document.createElement('div');
  ring.className = 'why-ring';
  const list = document.createElement('ul');
  list.className = 'why-items';
  arc.append(ring, list);
  let art = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const texts = [...row.querySelectorAll('p, h2, h3, h4, h5, h6')].filter((p) => hasText(p) && !pic(p));
    if (!texts.length) {
      const m = media(row);
      if (m) art = wrapNode(m, 'why-m-art');
      return;
    }
    const li = document.createElement('li');
    li.className = `why-item why-item-${list.children.length}`;
    const circle = document.createElement('span');
    circle.className = 'why-circle';
    const m = media(cells[0]) || media(row);
    if (m) circle.append(m);
    const label = document.createElement('div');
    label.className = 'why-label';
    texts.forEach((p) => {
      const a = p.querySelector('a');
      if (a) {
        a.setAttribute('aria-label', a.textContent.trim());
        const box = wrapNode(p, 'why-more');
        if (/!#$/.test(a.getAttribute('href') || '')) box.classList.add('why-more-hidden');
        label.append(box);
      } else label.append(wrapNode(p, 'why-text'));
    });
    li.append(circle, label);
    list.append(li);
  });

  block.replaceChildren();
  if (head) block.append(head);
  block.append(arc);
  const mobile = document.createElement('div');
  mobile.className = 'why-m only-m';
  mobile.append(mobileGrid(list));
  if (art) mobile.append(art);
  block.append(mobile);
  block.querySelectorAll('.why-circle img').forEach((img) => {
    img.loading = 'eager';
  });
}
