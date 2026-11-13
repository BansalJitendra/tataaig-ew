/**
 * products — "Our Products": lines of business, each a head (icon, title link, line) and a
 * grid of product cards. Schema: stardust/eds-schema/index.json § prod.
 * Decode tier: reconstructive (repeat group).
 *
 * Authoring: section heading as default content before the block (reabsorbed, EW8).
 * Rows, one per line of business:
 *   cell 1 — icon image, title paragraph (a link; plain text = the "other" line, laid out
 *            full width), optional description paragraph
 *   cell 2 — per product: the icon image, then a paragraph holding the product link
 *            (its text is the label; a deliberate line break allowed). A "(…)" suffix is the
 *            desktop-only part of the label (the mobile label is a presentational clone
 *            without it — the source swaps two label nodes by width, EW4).
 * Card-as-link (EW6): the card is a generated <a> carrying the authored href; the authored
 * inner anchor is unwrapped so the label paragraph stays editable.
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
  head.className = 'prod-title';
  head.append(...prev.childNodes);
  prev.remove();
  return head;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

// one product card from its label paragraph (holding the link) and its icon
function buildCard(p, icon) {
  const a = p.querySelector('a[href]');
  const card = document.createElement('a');
  card.className = 'prod-card';
  card.href = a.href;
  const inner = pic(a);
  const img = icon || (inner ? inner.closest('picture') || inner : null);
  if (img) card.append(img);
  a.replaceWith(...a.childNodes);
  card.append(wrapNode(p, 'only-d'));
  const mobile = stripInstrumentation(p.cloneNode(true));
  const last = mobile.lastChild;
  if (last && last.nodeType === 3 && /\s*\([^()]*\)\s*$/.test(last.textContent) && last.textContent.indexOf('(') > 0) {
    last.textContent = last.textContent.replace(/\s*\([^()]*\)\s*$/, '');
  }
  card.append(wrapNode(mobile, 'only-m'));
  return card;
}

export default function decorate(block) {
  const head = absorbHead(block);
  const inner = document.createElement('div');
  inner.className = 'prod-inner';
  if (head) inner.append(head);
  const lobs = document.createElement('div');
  lobs.className = 'prod-lobs';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!hasText(row)) return;
    const lob = document.createElement('div');
    lob.className = `prod-lob prod-lob-${lobs.children.length}`;
    // product = a paragraph holding a link (the label), its icon image just before it;
    // cell 1 is the head, the following cell(s) hold the products
    const headCell = cells[0];
    const productNodes = cells.slice(1).flatMap((c) => [...c.children]);
    const cards = [];
    let pendingIcon = null;
    productNodes.forEach((n) => {
      if (n.tagName === 'P' && n.querySelector('a[href]') && hasText(n)) {
        cards.push({ p: n, icon: pendingIcon });
        pendingIcon = null;
      } else if (pic(n)) pendingIcon = media(n);
    });
    const headTexts = [...headCell.querySelectorAll('p, h2, h3, h4')].filter((p) => hasText(p) && !pic(p));

    const lobHead = document.createElement('div');
    lobHead.className = 'prod-head';
    const icon = media(headCell);
    if (icon) lobHead.append(wrapNode(icon, 'prod-lobimg'));
    const textBox = document.createElement('div');
    const [titleP, ...descPs] = headTexts;
    if (titleP) {
      const title = wrapNode(titleP, 'prod-lobtitle');
      if (titleP.querySelector('a')) {
        const arrow = document.createElement('span');
        arrow.className = 'prod-arrow';
        const img = document.createElement('img');
        img.src = '/icons/Icon_9b93180372.svg';
        img.alt = '';
        arrow.append(img);
        title.append(arrow);
      } else lob.classList.add('prod-lob-other');
      textBox.append(title);
    }
    descPs.forEach((p) => textBox.append(wrapNode(p, 'prod-lobdesc')));
    lobHead.append(textBox);

    const grid = document.createElement('ul');
    grid.className = 'prod-grid';
    cards.forEach((c) => grid.append(wrapNode(buildCard(c.p, c.icon), 'prod-col', 'li')));
    lob.append(lobHead, grid);
    lobs.append(lob);
  });

  inner.append(lobs);
  block.replaceChildren(inner);
  block.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
  });
}
