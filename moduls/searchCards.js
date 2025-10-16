import renderProductCards from './renderProductCards.js';

export default function searchCards(searchBtn, productCardsList, navItems) {
  const productList = JSON.parse(localStorage.getItem('productList')) || [];
  searchBtn.addEventListener('click', () => {
    const searchInp = document.querySelector('.header__search-inp').value.trim().toLowerCase();
    if (!searchInp) return;
    localStorage.removeItem('category');
    localStorage.removeItem('nav-active');
    navItems.forEach(item => item.classList.remove('nav__item-active'));
    const productSearch = productList.filter(el =>
      el.title.toLowerCase().includes(searchInp)
    );

    // отображаем найденные
    renderProductCards(null, productCardsList, productSearch);

    // обновляем заголовок
    document.querySelector('.product-cards__title').textContent = "Результаты поиска";
  });
}
