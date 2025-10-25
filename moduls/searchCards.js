import renderProductCards from './renderProductCards.js';

export default function searchCards(searchBtn, productCardsList, navItems, cardsArray) {
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInp = document.querySelector('.header__search-inp').value.trim().toLowerCase();
    if (!searchInp) return;

    // чистим категории и активный нав
    localStorage.removeItem('category');
    localStorage.removeItem('nav-active');
    navItems.forEach(item => item.classList.remove('nav__item-active'));

    // берём из localStorage или fallback на searchArray
    const productList = cardsArray;

    const productSearch = productList.filter(el =>
      el.title.toLowerCase().includes(searchInp)
    );

    // отображаем найденные
    renderProductCards(null, productCardsList, productSearch);

    // обновляем заголовок
    document.querySelector('.product-cards__title').textContent = "Результаты поиска";
  });
}