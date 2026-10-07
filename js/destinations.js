/* Top destinations: hover-expand gallery.
   Desktop (hover + wide): a flex row where the active card grows; hover or the arrows pick it.
   Touch / narrow: a snap-scrolling row; the arrows scroll it by one card. */

const ITEMS = [
  { image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', text: 'Serengeti Safari' },
  { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', text: 'Zanzibar Beach' },
  { image: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800', text: 'Cappadocia Balloons' },
  { image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800', text: 'Private Yacht' },
  { image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=800', text: 'Lalibela Churches' },
  { image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', text: 'Luxury Villa' },
  { image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', text: 'Fine Dining' },
  { image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', text: 'Helicopter View' },
  { image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800', text: 'Black Sea' },
];

// Keep in sync with the expand-row media query in style.css
const expandRow = window.matchMedia('(hover: hover) and (min-width: 62em)');

const list = document.querySelector('[data-destinations]');
if (list) {
  list.innerHTML = ITEMS.map(({ image, text }) => `
    <li class="dest__card">
      <img src="${image}" alt="${text}" loading="lazy" decoding="async">
    </li>`).join('');

  const cards = [...list.children];
  let active = 0;
  const setActive = (i) => {
    cards[active].classList.remove('is-active');
    active = (i + cards.length) % cards.length;
    cards[active].classList.add('is-active');
  };
  setActive(0);

  cards.forEach((card, i) => card.addEventListener('pointerenter', () => {
    if (expandRow.matches) setActive(i);
  }));

  const step = (dir) => {
    if (expandRow.matches) return setActive(active + dir);
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    list.scrollBy({ left: dir * (cards[0].offsetWidth + gap), behavior: 'smooth' });
  };
  document.querySelector('[data-destinations-prev]')?.addEventListener('click', () => step(-1));
  document.querySelector('[data-destinations-next]')?.addEventListener('click', () => step(1));
}
