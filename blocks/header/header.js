import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * TATA AIG header — template-slotted from the replica prototype (canon.css chrome).
 * Authored content comes from the /nav document; sections are classified by content:
 *   strip      a lone text paragraph (scrolling GST strip)
 *   banner     a heading + text + link (mobile install banner)
 *   app        an image + text (floating Download App tile)
 *   brand      an image only (logo; linked to the home page here)
 *   nav        a list with nested lists (mega menus) + plain links (a link with an icon = pill)
 *   a11y       a list whose items carry :access-*: icons (accessibility panel labels)
 * Behaviour per stardust/chrome/header-contract.json:
 * mega menus + accessibility panel open on click (outside click / Escape close); at <=767px the
 * hamburger opens the nav as a drawer and the accessibility button opens a bottom sheet.
 * @ew-exempt <span> "100%" / "No" control state text — derived UI state, not authored
 */

const MOBILE = window.matchMedia('(width <= 767px)');
const ICONS = `${window.hlx?.codeBasePath || ''}/icons`;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function iconImg(name, className = '', alt = '', ext = 'svg') {
  return el('img', className, {
    src: `${ICONS}/${name}.${ext}`, alt, loading: 'lazy',
  });
}

function slug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** unwrap a <p> that the pipeline puts around a list item's link or label (#98) */
function unwrapP(li) {
  li.querySelectorAll(':scope > p').forEach((p) => p.replaceWith(...p.childNodes));
}

function classify(fragment) {
  const roles = {};
  fragment.querySelectorAll(':scope > .section').forEach((section) => {
    const w = section.querySelector('.default-content-wrapper') || section;
    const text = w.textContent.trim();
    const hasMedia = !!w.querySelector('picture, img:not(.icon img)');
    if (!roles.nav && w.querySelector('li ul, li ol')) roles.nav = w;
    else if (!roles.a11y && w.querySelector('li .icon[class*="icon-access"]')) roles.a11y = w;
    else if (!roles.banner && w.querySelector('h1, h2, h3, h4, h5, h6')) roles.banner = w;
    else if (hasMedia && text && !roles.app) roles.app = w;
    else if (hasMedia && !roles.brand) roles.brand = w;
    else if (text && !roles.strip) roles.strip = w;
  });
  return roles;
}

function buildStrip(w) {
  const strip = el('div', 'gst-strip');
  const track = el('div', 'gst-strip-track');
  track.append(...w.children);
  strip.append(track);
  return strip;
}

function buildBanner(w) {
  const banner = el('div', 'app-banner');
  const text = el('div', 'app-banner-text');
  const link = el('div', 'app-banner-link');
  [...w.children].forEach((child) => {
    if (child.querySelector('a')) link.append(child);
    else text.append(child);
  });
  const a = link.querySelector('a');
  if (a) a.append(iconImg('arrow-right', 'app-banner-arrow', 'arrowRight'));
  banner.append(text, link);
  return banner;
}

function buildAppTile(w) {
  const tile = el('div', 'get-app-float');
  const img = el('div', 'get-app-float-img');
  const text = el('div', 'get-app-float-text');
  const title = el('div', 'get-app-float-title');
  const sub = el('div', 'get-app-float-sub');
  [...w.children].forEach((child) => {
    if (child.querySelector('picture, img')) img.append(child);
    else if (!title.children.length) title.append(child);
    else sub.append(child);
  });
  title.append(iconImg('arrow-right', 'get-app-float-arrow', 'Right arrow icon'));
  text.append(title, sub);
  tile.append(img, text);
  return tile;
}

function closeAll(header, except) {
  header.querySelectorAll('[aria-expanded="true"]').forEach((btn) => {
    if (btn === except) return;
    btn.setAttribute('aria-expanded', 'false');
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (panel && panel.tagName !== 'NAV') panel.hidden = true;
  });
  if (!except) {
    header.classList.remove('is-drawer-open', 'is-sheet-open');
    document.body.style.overflowY = '';
  }
}

function bindToggle(header, btn, panel, onOpen) {
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', panel.id);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.getAttribute('aria-expanded') !== 'true';
    closeAll(header, btn);
    btn.setAttribute('aria-expanded', String(open));
    if (panel.tagName !== 'NAV') panel.hidden = !open;
    if (onOpen) onOpen(open);
  });
}

function selectCat(mega, cat) {
  mega.querySelectorAll('.mega-cat').forEach((c) => {
    const on = c === cat;
    c.classList.toggle('is-selected', on);
    const links = mega.querySelector(`#${c.dataset.panel}`);
    if (links) links.hidden = !on;
  });
}

function buildMega(li, sub, index) {
  const label = slug(li.querySelector('.site-nav-toggle').textContent);
  const mega = el('div', `mega mega-${label}`, { id: `mega-${index}`, role: 'menu' });
  mega.hidden = true;
  sub.classList.add('mega-cats');
  const panel = el('div', 'mega-panel');
  [...sub.children].forEach((cat, i) => {
    unwrapP(cat);
    cat.classList.add('mega-cat');
    const a = cat.querySelector(':scope > a');
    if (a) a.append(iconImg('mega-arrow', 'mega-arrow', 'arrow'));
    const links = cat.querySelector(':scope > ul');
    if (links) {
      links.classList.add('mega-links');
      links.id = `mega-${index}-${i}`;
      links.querySelectorAll(':scope > li').forEach(unwrapP);
      cat.dataset.panel = links.id;
      panel.append(links);
      cat.addEventListener('mouseenter', () => selectCat(mega, cat));
      cat.addEventListener('focusin', () => selectCat(mega, cat));
    }
  });
  mega.append(sub);
  if (panel.children.length) {
    mega.append(panel);
    selectCat(mega, sub.querySelector('.mega-cat[data-panel]'));
  }
  return mega;
}

function buildNav(header, w, brandLink) {
  const nav = el('nav', 'site-nav', { 'aria-label': 'Main', id: 'site-nav' });
  const head = el('div', 'site-nav-head');
  if (brandLink) {
    const logo = brandLink.cloneNode(true);
    logo.classList.add('site-nav-logo');
    logo.removeAttribute('aria-label');
    head.append(logo);
  }
  const close = el('button', 'site-nav-close', { type: 'button', 'aria-label': 'Close menu' });
  close.addEventListener('click', () => closeAll(header));
  head.append(close);

  const list = w.querySelector('ul');
  list.classList.add('site-nav-list');
  [...list.children].forEach((li, index) => {
    li.classList.add('site-nav-item');
    const sub = li.querySelector(':scope > ul');
    if (sub) {
      li.classList.add('site-nav-drop');
      const btn = el('button', 'site-nav-toggle', { type: 'button' });
      const labelSpan = el('span');
      // move the authored label (text node or the pipeline's <p>) into the trigger
      [...li.childNodes].forEach((n) => {
        if (n === sub) return;
        if (n.nodeType === 1 && n.tagName === 'P') labelSpan.append(...n.childNodes);
        else labelSpan.append(n);
      });
      li.querySelectorAll(':scope > p').forEach((p) => p.remove());
      btn.append(labelSpan, iconImg('nav-chevron', 'site-nav-chev', 'X'));
      li.prepend(btn);
      const mega = buildMega(li, sub, index);
      li.append(mega);
      bindToggle(header, btn, mega);
    } else {
      unwrapP(li);
      const a = li.querySelector('a');
      if (a) a.classList.add(a.querySelector('.icon') ? 'site-nav-pill' : 'site-nav-link');
    }
  });
  nav.append(head, list);
  return nav;
}

function buildA11y(header, w) {
  const panel = el('div', 'a11y-panel', { id: 'a11y-panel' });
  panel.hidden = true;
  // mobile: a full-screen close surface behind the bottom sheet (the source's backdrop button)
  const scrim = el('button', 'a11y-scrim', { type: 'button', 'aria-label': 'Close' });
  scrim.addEventListener('click', () => closeAll(header));
  panel.append(scrim);
  const sheet = el('div', 'a11y-sheet');
  sheet.append(el('span', 'a11y-handle'));
  panel.append(sheet);
  const list = w.querySelector('ul');
  if (!list) return panel;
  list.classList.add('a11y-list');
  const root = document.documentElement;
  const state = { zoom: 100, font: 100 };
  const updates = [];
  [...list.children].forEach((li) => {
    unwrapP(li);
    li.classList.add('a11y-row');
    const label = el('span', 'a11y-label');
    label.append(...li.childNodes);
    li.append(label);
    const iconName = (li.querySelector('.icon')?.className.match(/icon-access-([a-z-]+)/) || [])[1];
    if (iconName === 'zoom' || iconName === 'text') {
      const key = iconName === 'zoom' ? 'zoom' : 'font';
      const range = el('span', 'a11y-range');
      const minus = el('button', 'a11y-step', { type: 'button', 'aria-label': 'Decrease' });
      const plus = el('button', 'a11y-step', { type: 'button', 'aria-label': 'Increase' });
      minus.append(iconImg('access-minus', '', '-'));
      plus.append(iconImg('access-plus', '', '+'));
      const value = el('span', 'a11y-value');
      const render = () => {
        value.textContent = `${state[key]}%`;
        if (key === 'zoom') document.body.style.zoom = state.zoom === 100 ? '' : `${state.zoom}%`;
        else root.style.fontSize = state.font === 100 ? '' : `${state.font}%`;
      };
      minus.addEventListener('click', () => { state[key] = Math.max(50, state[key] - 10); render(); });
      plus.addEventListener('click', () => { state[key] = Math.min(200, state[key] + 10); render(); });
      updates.push(() => { state[key] = 100; render(); });
      render();
      range.append(minus, value, plus);
      li.append(range);
    } else if (iconName === 'reset') {
      li.classList.add('a11y-reset');
      li.addEventListener('click', () => updates.forEach((fn) => fn()));
    } else if (iconName) {
      const cls = `a11y-${iconName}`;
      const sw = el('button', 'a11y-switch', {
        type: 'button', role: 'switch', 'aria-checked': 'false', 'aria-label': li.textContent,
      });
      const knob = el('span', 'a11y-knob');
      const txt = el('span', 'a11y-state');
      const render = (on) => {
        sw.setAttribute('aria-checked', String(on));
        txt.textContent = on ? 'Yes' : 'No';
        root.classList.toggle(cls, on);
      };
      sw.addEventListener('click', () => render(sw.getAttribute('aria-checked') !== 'true'));
      updates.push(() => render(false));
      render(false);
      sw.append(knob, txt);
      li.append(sw);
    }
  });
  sheet.append(list);
  panel.addEventListener('click', (e) => {
    e.stopPropagation();
    // mobile: the panel is the full-screen overlay; a tap outside the sheet closes it
    if (e.target === panel) closeAll(header);
  });
  return panel;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;
  const header = block.closest('header') || block;
  const roles = classify(fragment);

  if (roles.strip) block.append(buildStrip(roles.strip));

  // the install banner and the Download App tile sit at body level on the source (fixed, z 1000)
  document.querySelector('body > .header-floats')?.remove();
  const floats = el('div', 'header-floats');
  if (roles.banner) floats.append(buildBanner(roles.banner));
  if (roles.app) floats.append(buildAppTile(roles.app));
  if (floats.children.length) document.body.append(floats);

  block.append(el('div', 'header-pad'));

  const site = el('div', 'site-header', { id: 'fixHeader' });
  const inner = el('div', 'site-header-inner');
  let brandLink = null;
  if (roles.brand) {
    brandLink = el('a', 'site-header-logo', { href: '/' });
    const media = roles.brand.querySelector('picture') || roles.brand.querySelector('img');
    const authoredLink = roles.brand.querySelector('a');
    if (authoredLink) brandLink.href = authoredLink.href;
    brandLink.append(media);
    const alt = media.querySelector?.('img')?.alt || media.alt;
    if (alt) brandLink.setAttribute('aria-label', alt);
    inner.append(brandLink);
  }

  const phone = el('div', 'site-header-phone');
  const phoneA11y = el('button', 'site-header-round', {
    type: 'button', 'aria-label': 'Accessibility options',
  });
  phoneA11y.append(iconImg('access-menu', '', 'X'));
  // accessible name from the icon's alt ("X"), as on the source (header contract pairs by name)
  const burger = el('button', 'site-header-round', { type: 'button' });
  burger.append(iconImg('nav-toggle', '', 'X'));
  phone.append(phoneA11y, burger);
  inner.append(phone);

  const backdrop = el('div', 'header-backdrop');
  backdrop.addEventListener('click', () => closeAll(header));

  if (roles.nav) {
    const nav = buildNav(header, roles.nav, brandLink);
    inner.append(nav);
    const lockScroll = (cls) => (open) => {
      header.classList.toggle(cls, open);
      document.body.style.overflowY = open ? 'hidden' : '';
    };
    bindToggle(header, burger, nav, lockScroll('is-drawer-open'));
    if (roles.a11y) {
      const panel = buildA11y(header, roles.a11y);
      const li = el('li', 'site-nav-item site-nav-a11y');
      const toggle = el('button', 'a11y-toggle', {
        type: 'button', 'aria-label': 'Accessibility Options', 'aria-haspopup': 'true',
      });
      const menuIcon = iconImg('access-menu', 'a11y-icon', 'access');
      menuIcon.width = 32;
      menuIcon.height = 32;
      toggle.append(menuIcon, iconImg('icon-down', 'a11y-chev', 'arrow', 'png'));
      li.append(toggle);
      nav.querySelector('.site-nav-list').append(li);
      inner.append(panel);
      bindToggle(header, toggle, panel);
      bindToggle(header, phoneA11y, panel, lockScroll('is-sheet-open'));
    }
  }
  // the drawer is the nav itself: visible by CSS on desktop, toggled on mobile
  MOBILE.addEventListener('change', () => closeAll(header));

  site.append(inner);
  block.append(site, backdrop);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-nav, .a11y-panel, .site-header-phone')) closeAll(header);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = header.querySelector('[aria-expanded="true"]');
    closeAll(header);
    if (open) open.focus();
  });
}
