import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * TATA AIG footer — template-slotted from the replica prototype (canon.css secondLastFooter_*).
 * On the source the footer content sits inside <main> and <footer> is empty; here it is the
 * footer block, fed by the /footer document. Sections are classified by content:
 *   brand    the section with images (logo, store badges, social list)
 *   columns  the first "title paragraph + link list" section (Company / Resources / …)
 *   products the second such section (desktop accordion row / mobile accordion cards)
 *   legal    the section that opens with a link list (legal links + statutory text)
 * Authored nodes are moved, never rebuilt (EW1); toggles are separate chevron buttons (EW7).
 */

const ICONS = `${window.hlx?.codeBasePath || ''}/icons`;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function chevron() {
  return el('img', '', { src: `${ICONS}/icon-down.png`, alt: 'iconDown', loading: 'lazy' });
}

function isPairs(w) {
  const kids = [...w.children];
  return kids.length > 1 && kids[0].tagName === 'P' && kids.some((k) => k.tagName === 'UL');
}

function classify(fragment) {
  const roles = {};
  fragment.querySelectorAll(':scope > .section').forEach((section) => {
    const w = section.querySelector('.default-content-wrapper') || section;
    const first = w.firstElementChild;
    if (!first) return;
    if (!roles.brand && w.querySelector('picture, img:not(.icon img)')) roles.brand = w;
    else if (first.tagName === 'UL' && !roles.legal) roles.legal = w;
    else if (isPairs(w) && !roles.columns) roles.columns = w;
    else if (isPairs(w) && !roles.products) roles.products = w;
  });
  return roles;
}

/** groups a flat "p, ul, p, ul…" run into [{ title, list }] */
function pairs(w) {
  const groups = [];
  [...w.children].forEach((node) => {
    if (node.tagName === 'UL' || node.tagName === 'OL') {
      if (!groups.length) groups.push({ title: null, list: node });
      else groups[groups.length - 1].list = node;
    } else {
      groups.push({ title: node, list: null });
    }
  });
  return groups;
}

function buildBrand(w) {
  const brand = el('div', 'foot-brand');
  const logo = el('div', 'foot-logo');
  const app = el('div', 'foot-app');
  const follow = el('div', 'foot-follow');
  const social = el('div', 'foot-social');
  [...w.children].forEach((node) => {
    const media = node.querySelector('picture, img:not(.icon img)');
    if (node.tagName === 'UL') {
      node.querySelectorAll('a').forEach((a) => {
        a.classList.add('foot-sm');
        const name = a.querySelector('.icon')?.className.match(/icon-([a-z-]+)/)?.[1];
        if (name && !a.getAttribute('aria-label')) a.setAttribute('aria-label', name);
      });
      social.append(node);
    } else if (media && !node.querySelector('a') && !logo.children.length) {
      logo.append(node);
    } else if (media) {
      app.append(node);
    } else if (!app.querySelector('picture, img')) {
      const title = el('div', 'foot-apptitle');
      title.append(node);
      app.append(title);
    } else {
      follow.append(node);
    }
  });
  brand.append(logo, app, follow, social, el('div', 'foot-rule'));
  return brand;
}

function buildColumns(w) {
  return pairs(w).map(({ title, list }) => {
    const col = el('div', 'foot-col');
    if (title) {
      const head = el('div', 'foot-colhead');
      head.append(title);
      col.append(head);
    }
    if (list) {
      list.classList.add('foot-links');
      col.append(list);
    }
    return col;
  });
}

function buildProducts(w) {
  const acc = el('div', 'foot-acc');
  const grid = el('div', 'foot-acc-grid', { id: 'foot-acc-grid' });
  const toggle = el('button', 'foot-acc-toggle', {
    type: 'button', 'aria-expanded': 'false', 'aria-controls': grid.id, 'aria-label': 'Show all',
  });
  toggle.append(chevron());
  toggle.addEventListener('click', () => {
    const open = !acc.classList.contains('is-open');
    acc.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  pairs(w).forEach(({ title, list }, i) => {
    const group = el('div', 'foot-acc-group');
    const head = el('div', 'foot-acc-title');
    const body = el('div', 'foot-acc-list', { id: `foot-acc-${i}` });
    const chev = el('button', 'foot-acc-chev', {
      type: 'button', 'aria-expanded': 'false', 'aria-controls': body.id,
    });
    chev.append(chevron());
    if (title) head.append(title);
    head.append(chev);
    if (list) body.append(list);
    // mobile: the whole title row toggles its own card (the chevron carries the state)
    head.addEventListener('click', () => {
      const open = !group.classList.contains('is-open');
      group.classList.toggle('is-open', open);
      chev.setAttribute('aria-expanded', String(open));
    });
    group.append(head, body);
    grid.append(group);
  });
  acc.append(toggle, grid);
  return acc;
}

function buildLegal(w) {
  const legal = el('div', 'foot-legal');
  const inner = el('div', 'foot-legal-inner');
  const links = el('div', 'foot-legal-links');
  const marked = el('div', 'foot-marked');
  [...w.children].forEach((node) => {
    if (node.tagName === 'UL' && !links.children.length) links.append(node);
    else marked.append(node);
  });
  inner.append(links, marked);
  legal.append(inner);
  return legal;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;
  const roles = classify(fragment);

  const site = el('div', 'site-footer');
  const inner = el('div', 'foot-inner');
  inner.append(el('div', 'foot-deco'));
  const card = el('div', 'foot-card');
  if (roles.brand) card.append(buildBrand(roles.brand));
  if (roles.columns) card.append(...buildColumns(roles.columns));
  inner.append(card);
  if (roles.products) inner.append(buildProducts(roles.products));
  site.append(inner);
  if (roles.legal) site.append(buildLegal(roles.legal));
  block.append(site);
}
