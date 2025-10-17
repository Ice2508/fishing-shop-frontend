



import renderProductCards from './renderProductCards.js';

function setActiveNav(navItem, index) {
  navItem.forEach(el => el.classList.remove('nav__item-active'));
  navItem[index].classList.add('nav__item-active');
}

export default function categoriesFilter(navItem, productCardsList, cardsArray) {
  if (!cardsArray) return;

  navItem.forEach((item, i) => {
    item.addEventListener('click', async () => {
      setActiveNav(navItem, i);
      localStorage.setItem('nav-active', i);
      const category = item.dataset.categories;
      window.location.hash = category;
      localStorage.setItem('category', category);
      await renderProductCards(category, productCardsList, cardsArray);
      window.scrollTo(0, 160);
    });
  });
}