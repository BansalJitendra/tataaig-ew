/**
 * get-app — "Get our app" band: copy + benefit list, phone screenshot, QR card and store
 * badges. Schema: stardust/eds-schema/index.json § app. Decode tier: template-slotted.
 *
 * Authoring (one row, up to four cells; classified by content, not position):
 *   copy — heading, lede paragraph, benefit list
 *   images without links — first = phone screenshot, second = QR code (desktop only)
 *   linked images — the store badges
 */

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(node);
  return w;
}
const hasText = (n) => !!n && n.textContent.replace(/\s+/g, '').length > 0;

export default function decorate(block) {
  const inner = document.createElement('div');
  inner.className = 'app-inner';
  const copy = document.createElement('div');
  copy.className = 'app-copy';
  const badges = document.createElement('div');
  badges.className = 'app-badges';
  const loose = [];

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) copy.append(wrapNode(n, 'app-title'));
    else if (n.tagName === 'UL' || n.tagName === 'OL') copy.append(wrapNode(n, 'app-list'));
    else if (n.querySelector && n.querySelector('a') && n.querySelector('picture, img')) badges.append(n);
    else if (n.matches('picture, img') || (n.querySelector && n.querySelector('picture, img'))) {
      const img = n.matches('picture, img') ? n : n.querySelector('picture, img');
      loose.push(img.closest('picture') || img);
    } else if (hasText(n)) copy.append(wrapNode(n, 'app-lede'));
  });

  inner.append(copy);
  const [phone, qr] = loose;
  if (phone) inner.append(wrapNode(phone, 'app-phone'));
  if (qr) inner.append(wrapNode(wrapNode(qr, 'app-qrcard'), 'app-qr only-d'));
  inner.append(badges);
  block.replaceChildren(inner);
}
