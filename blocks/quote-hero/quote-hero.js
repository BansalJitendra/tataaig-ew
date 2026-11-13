/**
 * quote-hero — the home first fold: product quote tabs (Car / Bike / Health / Travel / More),
 * the campaign art and the scroll cue (source: home first fold, motorCategory_ /
 * secondaryFlowEntry_). Schema: stardust/eds-schema/index.json § first-fold.
 * Decode tier: template-slotted panel per tab (fixed composition), tabs reconstructive.
 *
 * Authoring rows:
 *   Tab row (2 cells):
 *     cell 1 — tab icon (image) + tab label paragraph
 *     cell 2 — the panel, in order:
 *       h2 panel title
 *       before the CTA (all optional):
 *         p with an :icon: (e.g. :quote-shine:) — the auto-fetch note
 *         ul — segmented choice (Leisure/Business | Student)
 *         p — field label when followed by a placeholder paragraph, else a sub line
 *         p holding only <em> — the input placeholder (rendered over the input);
 *           with a leading :quote-search: icon the input is a search pill
 *       p <strong><a> — the Buy now CTA; its href is the hand-off to the source quote
 *         journey on www.tataaig.com (dynamic-features D1)
 *       after the CTA — one paragraph per flow card: image + text (<strong> = bold,
 *         <em> = medium, "(…)" = small note); a paragraph without an image right after a
 *         card is that card's mobile wording; a trailing :flow-down: icon replaces the
 *         default forward arrow. Three cards = new + pair layout (the new card shines in
 *         panels with an input); otherwise a stacked list.
 *       More panel: h3 group headings, each followed by a ul of image + label items
 *         (<strong> in an item = badge).
 *   Art row (1 cell, image only) — desktop campaign art.
 *   Scroll row (1 cell, image + label) — the scroll cue.
 */

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(node);
  return w;
}
function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}
const pic = (n) => (n ? (n.matches('picture, img') && n) || n.querySelector('picture, img') : null);
const hasText = (n) => !!n && n.textContent.replace(/\s+/g, '').length > 0;
const onlyEm = (p) => {
  const kids = [...p.children].filter((c) => !c.classList.contains('icon'));
  return kids.length === 1 && kids[0].tagName === 'EM'
    && [...p.childNodes].every((c) => c.nodeType !== 3 || !c.textContent.trim());
};

// split a "(…)" note inside the paragraph into span.small — presentation only, text unchanged
function markSmall(p) {
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const i = node.textContent.indexOf('(');
    if (i >= 0 && node.parentElement.closest('.small') === null) {
      const rest = node.splitText(i);
      const span = document.createElement('span');
      span.className = 'small';
      rest.replaceWith(span);
      span.append(rest);
      return true;
    }
    node = walker.nextNode();
  }
  return false;
}

function flowCard(p, mobileP) {
  const card = el('div', 'flow-card');
  const main = el('div', 'flow-card-main');
  const media = pic(p);
  const mediaNode = media ? media.closest('picture') || media : null;
  if (mediaNode) {
    if (mediaNode.parentElement !== p) p.prepend(mediaNode);
    main.append(wrapNode(mediaNode, 'flow-card-icon'));
  }
  const go = el('span', 'flow-card-go');
  const down = p.querySelector('.icon-flow-down');
  if (down) go.append(down);
  else go.append(el('img', '', { src: '/icons/newForwardIcon.svg', alt: '', 'aria-hidden': 'true' }));
  const text = el('div', 'flow-card-text');
  const small = markSmall(p);
  if (small) card.classList.add('flow-card-calc');
  if (mobileP) {
    text.append(wrapNode(p, 'only-d'), wrapNode(mobileP, 'only-m'));
  } else {
    text.append(p);
  }
  main.append(text);
  card.append(main, go);
  return card;
}

function buildFlows(nodes, shine) {
  const flows = el('div', 'quote-flows');
  const cards = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const p = nodes[i];
    const next = nodes[i + 1];
    const mobile = next && next.tagName === 'P' && !pic(next) ? next : null;
    if (mobile) i += 1;
    cards.push(flowCard(p, mobile));
  }
  if (cards.length === 3) {
    const [first, second, third] = cards;
    const top = el('div', 'quote-flows-new');
    if (shine) {
      const shiny = el('div', 'flow-card-shiny');
      const sh = el('div', 'flow-card-shine', { 'aria-hidden': 'true' });
      sh.append(el('img', '', { src: '/icons/shineLine.svg', alt: '' }));
      shiny.append(first, sh);
      top.append(shiny);
    } else top.append(first);
    const pair = el('div', 'quote-flows-pair');
    pair.append(second, wrapNode(third, 'quote-flows-calc'));
    flows.append(top, pair);
  } else {
    flows.classList.add('quote-flows-list');
    flows.append(...cards);
  }
  return flows;
}

// The submit control: the source renders <button>Buy now</button> (no link). The authored link
// carries the hand-off target (D1); its paragraph moves into a button-like wrapper and the
// anchor is unwrapped (EW6), so the label stays editable and the role matches the source.
function buildCta(p) {
  const wrap = el('div', 'quote-card-cta');
  const btn = el('div', 'quote-card-btn', { role: 'link', tabindex: '0' });
  const a = p.querySelector('a[href]');
  const href = a ? a.href : '';
  if (a) {
    a.replaceWith(...a.childNodes);
  }
  p.querySelectorAll('strong, em').forEach((n) => n.replaceWith(...n.childNodes));
  p.classList.remove('button-wrapper');
  btn.dataset.href = href;
  btn.append(p);
  const go = () => {
    if (btn.dataset.href) window.location.assign(btn.dataset.href);
  };
  btn.addEventListener('click', go);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') go();
  });
  wrap.append(btn);
  return wrap;
}

let uid = 0;
function buildPanel(cell, id) {
  const panel = el('div', 'quote-panel', { role: 'tabpanel', id: `quote-panel-${id}` });
  const card = el('div', 'quote-card');
  const kids = [...cell.children];
  const heading = kids.find((k) => /^H[1-6]$/.test(k.tagName));
  const ctaIdx = kids.findIndex((k) => k.querySelector && k.querySelector('a'));
  const isMore = ctaIdx < 0 && kids.some((k) => k.tagName === 'UL');
  if (heading) card.append(wrapNode(heading, 'quote-card-title'));

  if (isMore) {
    card.classList.add('more-card');
    kids.filter((k) => k !== heading).forEach((k) => {
      if (/^H[1-6]$/.test(k.tagName)) card.append(wrapNode(k, 'more-card-heading'));
      else if (k.tagName === 'UL') {
        k.querySelectorAll('li').forEach((li) => {
          const badge = li.querySelector('strong');
          if (badge) li.classList.add('has-badge');
        });
        card.append(wrapNode(k, 'more-card-grid'));
      } else card.append(k);
    });
    panel.append(card);
    return panel;
  }

  const before = ctaIdx >= 0 ? kids.slice(0, ctaIdx) : kids;
  const after = ctaIdx >= 0 ? kids.slice(ctaIdx + 1) : [];
  let hasInput = false;
  let pendingLabel = null;
  const fieldId = `quote-field-${id}`;
  before.filter((k) => k !== heading).forEach((k, i, arr) => {
    if (k.tagName === 'UL') {
      const seg = wrapNode(k, 'quote-card-seg');
      const items = [...k.children];
      items.forEach((li, n) => {
        li.setAttribute('tabindex', '0');
        if (n === 0) li.classList.add('is-on');
        li.addEventListener('click', () => items.forEach((o) => o.classList.toggle('is-on', o === li)));
      });
      card.append(seg);
    } else if (k.tagName === 'P' && onlyEm(k)) {
      hasInput = true;
      const icon = k.querySelector('.icon');
      const input = el('input', icon ? '' : 'quote-card-input', { type: 'text', id: fieldId, autocomplete: 'off' });
      const em = k.querySelector('em');
      if (em) input.setAttribute('placeholder', em.textContent.trim());
      const ph = wrapNode(k, 'quote-card-ph');
      ph.setAttribute('aria-hidden', 'true');
      const field = el('div', icon ? 'quote-card-search' : 'quote-card-field');
      if (icon) field.append(icon);
      field.append(input, ph);
      input.addEventListener('input', () => field.classList.toggle('has-value', !!input.value));
      if (pendingLabel) {
        pendingLabel.id = `${fieldId}-label`;
        input.setAttribute('aria-labelledby', pendingLabel.id);
        const wrap = el('div', icon ? 'quote-card-dest' : 'quote-card-entry');
        wrap.append(pendingLabel, field);
        card.append(wrap);
        pendingLabel = null;
      } else card.append(field);
    } else if (k.tagName === 'P' && k.querySelector('.icon')) {
      card.append(wrapNode(k, 'quote-card-fetch'));
    } else if (k.tagName === 'P') {
      const next = arr[i + 1];
      if (next && next.tagName === 'P' && onlyEm(next)) pendingLabel = wrapNode(k, 'quote-card-label');
      else card.append(wrapNode(k, 'quote-card-sub'));
    } else card.append(k);
  });
  if (ctaIdx >= 0) card.append(buildCta(kids[ctaIdx]));

  const flowNodes = after.filter((k) => k.tagName === 'P' && hasText(k));
  const leftovers = after.filter((k) => !flowNodes.includes(k) && hasText(k));
  panel.append(card);
  if (flowNodes.length) panel.append(buildFlows(flowNodes, hasInput));
  leftovers.forEach((k) => panel.append(k));
  return panel;
}

export default function decorate(block) {
  uid += 1;
  const rows = [...block.children];
  const inner = el('div', 'first-fold-inner');
  const left = el('div', 'first-fold-left');
  const tabs = el('div', 'quote-tabs', { role: 'tablist' });
  left.append(tabs);
  inner.append(left);
  let scroll = null;
  const tabEls = [];
  const panels = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const [head, body] = cells;
      const n = tabEls.length;
      const id = `${uid}-${n}`;
      const tab = el('div', 'quote-tab', {
        role: 'tab', tabindex: n === 0 ? '0' : '-1', 'aria-selected': String(n === 0), 'aria-controls': `quote-panel-${id}`, id: `quote-tab-${id}`,
      });
      const media = pic(head);
      if (media) tab.append(wrapNode(media.closest('picture') || media, 'quote-tab-card'));
      const label = [...head.querySelectorAll('p')].find(hasText);
      if (label) tab.append(wrapNode(label, 'quote-tab-label'));
      if (n === 0) tab.classList.add('is-active');
      const panel = buildPanel(body, id);
      panel.setAttribute('aria-labelledby', tab.id);
      panel.classList.add(`quote-panel-${n}`);
      if (n !== 0) panel.hidden = true;
      tabs.append(tab);
      left.append(panel);
      tabEls.push(tab);
      panels.push(panel);
    } else if (cells.length === 1) {
      const cell = cells[0];
      const media = pic(cell);
      const textP = [...cell.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].find((p) => hasText(p) && !pic(p));
      if (textP) {
        scroll = el('div', 'first-fold-scroll');
        if (media) scroll.append(wrapNode(media.closest('picture') || media, 'first-fold-scroll-icon'));
        scroll.append(wrapNode(textP, 'first-fold-scroll-label'));
      } else if (media) {
        inner.append(wrapNode(media.closest('picture') || media, 'first-fold-hero only-d'));
      }
    }
  });

  const select = (tab) => {
    tabEls.forEach((t, i) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.setAttribute('tabindex', on ? '0' : '-1');
      panels[i].hidden = !on;
    });
  };
  tabEls.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(t);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const d = e.key === 'ArrowRight' ? 1 : -1;
        const nt = tabEls[(i + d + tabEls.length) % tabEls.length];
        select(nt);
        nt.focus();
      }
    });
  });

  block.replaceChildren(inner);
  if (scroll) block.append(scroll);
  // small UI icons: load with the fold, not on scroll (the tabs and flow cards sit above it)
  block.querySelectorAll('.quote-tab-card img, .flow-card-icon img, .more-card-grid img').forEach((img) => {
    img.loading = 'eager';
  });
}
