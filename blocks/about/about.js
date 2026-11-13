/**
 * about — "About TATA AIG": heading, clamped body with a Show More / Show Less control and
 * the illustration. Schema: stardust/eds-schema/index.json § about. Decode tier:
 * template-slotted (fixed composition).
 *
 * Authoring (one row): text cell — heading, body paragraph(s), then the two control labels
 * as the last two paragraphs ("Show More", "Show Less"; shown one at a time) | image cell.
 */

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(node);
  return w;
}
const pic = (n) => (n ? (n.matches('picture, img') && n) || n.querySelector('picture, img') : null);
const hasText = (n) => !!n && n.textContent.replace(/\s+/g, '').length > 0;

let uid = 0;
export default function decorate(block) {
  uid += 1;
  const inner = document.createElement('div');
  inner.className = 'about-inner';
  const text = document.createElement('div');
  text.className = 'about-text';
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const m = pic(block);
  const art = m ? wrapNode(m.closest('picture') || m, 'about-art') : null;
  const ps = [...block.querySelectorAll('p')].filter((p) => hasText(p) && !pic(p));
  const labels = ps.length >= 3 ? ps.splice(-2) : [];
  if (heading) text.append(wrapNode(heading, 'about-title'));
  const body = document.createElement('div');
  body.className = 'about-body';
  body.id = `about-body-${uid}`;
  body.append(...ps);
  text.append(body);
  if (labels.length) {
    const more = document.createElement('div');
    more.className = 'about-more';
    const ctl = document.createElement('div');
    ctl.className = 'about-toggle';
    ctl.setAttribute('role', 'button');
    ctl.setAttribute('tabindex', '0');
    ctl.setAttribute('aria-controls', body.id);
    ctl.setAttribute('aria-expanded', 'false');
    const [showMore, showLess] = labels;
    ctl.append(wrapNode(showMore, 'about-show-more'), wrapNode(showLess, 'about-show-less'));
    const toggle = () => {
      const open = body.classList.toggle('is-open');
      ctl.classList.toggle('is-open', open);
      ctl.setAttribute('aria-expanded', String(open));
    };
    ctl.addEventListener('click', toggle);
    ctl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
    more.append(ctl);
    text.append(more);
  }
  inner.append(text);
  if (art) inner.append(art);
  block.replaceChildren(inner);
}
