/**
 * testimonials — "#ThisIsTataAIG" customer testimonial slider (source: slick slider,
 * next arrow advances one 370px slide, .5s). Schema: stardust/eds-schema/index.json § testi.
 * Decode tier: reconstructive (repeat group).
 *
 * Authoring: section heading + the "View All Reviews" link (<em> = outline button) as default
 * content before the block (reabsorbed into the head row, EW8).
 * Rows, one per testimonial: thumbnail image | name heading + description paragraph |
 * "Read More" paragraph (the control that expands the clamped description).
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
  head.className = 'testi-head';
  [...prev.children].forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) head.append(wrapNode(n, 'testi-title'));
    else if (n.querySelector('a')) head.append(wrapNode(n, 'testi-all'));
    else head.append(n);
  });
  prev.remove();
  return head;
}

function buildSlide(row) {
  const slide = document.createElement('li');
  slide.className = 'testi-slide';
  const card = document.createElement('article');
  card.className = 'testi-card';
  const mediaBox = document.createElement('div');
  mediaBox.className = 'testi-media';
  const m = media(row);
  if (m) mediaBox.append(m);
  const play = document.createElement('img');
  play.className = 'testi-play';
  play.src = '/icons/playIcon.svg';
  play.alt = '';
  mediaBox.append(play);
  const body = document.createElement('div');
  body.className = 'testi-body';
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) body.append(wrapNode(heading, 'testi-name'));
  const ps = [...row.querySelectorAll('p')].filter((p) => hasText(p) && !pic(p));
  const read = ps.length > 1 ? ps.pop() : null;
  const desc = document.createElement('div');
  desc.className = 'testi-desc';
  desc.append(...ps);
  body.append(desc);
  if (read) {
    const ctl = wrapNode(read, 'testi-read');
    ctl.setAttribute('role', 'button');
    ctl.setAttribute('tabindex', '0');
    ctl.setAttribute('aria-expanded', 'false');
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
    body.append(ctl);
  }
  card.append(mediaBox, body);
  slide.append(card);
  return slide;
}

export default function decorate(block) {
  const head = absorbHead(block);
  const slider = document.createElement('div');
  slider.className = 'testi-slider';
  const viewport = document.createElement('div');
  viewport.className = 'testi-viewport';
  const track = document.createElement('ul');
  track.className = 'testi-track';
  [...block.children].forEach((row) => {
    if (hasText(row) || pic(row)) track.append(buildSlide(row));
  });
  viewport.append(track);
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'testi-next only-d';
  next.setAttribute('aria-label', 'Next');
  const box = document.createElement('span');
  box.className = 'testi-next-box';
  const arrow = document.createElement('img');
  arrow.src = '/icons/iconRight.png';
  arrow.alt = '';
  box.append(arrow);
  next.append(box);
  slider.append(viewport, next);

  let i = 0;
  next.addEventListener('click', () => {
    const slides = [...track.children];
    if (!slides.length) return;
    const w = slides[0].getBoundingClientRect().width;
    const visible = Math.max(1, Math.round(viewport.getBoundingClientRect().width / w));
    i = (i + 1) > slides.length - visible ? 0 : i + 1;
    track.style.transform = `translateX(${-i * w}px)`;
  });

  block.replaceChildren();
  if (head) block.append(head);
  block.append(slider);
}
