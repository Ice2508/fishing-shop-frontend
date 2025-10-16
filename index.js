import loadCards from './api/loadCardsApi.js';
import renderProductCards from './moduls/renderProductCards.js';
import categoriesFilter from './moduls/categoriesFilter.js';
import animateCart from './moduls/animateCart.js';
import storeOrder from './moduls/storeOrder.js';
import renderOrder from './moduls/renderOrder.js';
import showCardDetails from './moduls/showCardDetails.js';
import searchCards from './moduls/searchCards.js';
import renderContacts from './moduls/renderContacts.js';

const navItems = document.querySelectorAll('.nav__item');
const productCardsList = document.querySelector('.product-cards__list');
const cart = document.querySelector('.header__cart');
const searchBtn = document.querySelector('.header__search-btn');
const contactsItem = document.querySelectorAll('.footer__contacts-item');
const productCardsTitle = document.querySelector('.product-cards__title');

// Загрузка контактов
function renderAbout(productCardsTitle, productCardsList) {
  productCardsList.innerHTML = `<section class="about">
    <div class="about__img-wrap">
      <img class="about__img" src="fon-about.webp">
    </div>
    <div class="about__info">
      <p>Мы — команда увлечённых рыболовов, для которых рыбалка — не просто хобби, а образ жизни. 
      Каждый из нас знает, что настоящая рыбалка начинается с правильного снаряжения. 
      Именно поэтому мы создали наш интернет-магазин — место, где каждый любитель и 
      профессионал найдёт всё необходимое для удачного улова.</p>
      <p>Наша цель — сделать рыбалку доступной, комфортной и по-настоящему вдохновляющей. 
      Мы тщательно подбираем ассортимент, тестируем снасти и оборудование, чтобы предложить 
      вам только проверенные товары, которым можно доверять в любых условиях.</p>
      <p>С нами вы всегда будете готовы к новым рыболовным приключениям, будь то утренний клёв на озере 
      или охота за трофейной щукой на реке.</p>
      <p><strong>Добро пожаловать в наш мир рыбалки! 🌊</strong></p>
    </div>
  </section>`;
  productCardsTitle.innerHTML = 'о нас';
  navItems.forEach(el => el.classList.remove('nav__item-active'));
}

// Навешиваем обработчик клика
function showAboutInfo(productCardsTitle, contactsItem, productCardsList) {
  contactsItem[0].addEventListener('click', () => {
    window.location.hash = 'about';
    renderAbout(productCardsTitle, productCardsList);
  });
}

// Инициализация корзины
storeOrder(productCardsList, cart);

// Делегирование клика для удаления товара
productCardsList.addEventListener('click', (e) => {
  if (!e.target.classList.contains('order__close')) return;

  const orderItem = e.target.closest('.order__item');
  const index = +orderItem.dataset.index;

  let order = JSON.parse(localStorage.getItem('order')) || [];

  // Удаляем товар по индексу
  order.splice(index, 1);

  localStorage.setItem('order', JSON.stringify(order));

  orderItem.remove();

  // Обновляем итоговую сумму
  const sum = order.reduce((acc, el) => acc + parseInt(el.price, 10), 0);
  const orderSumEl = document.querySelector('.order__sum');
  if(orderSumEl) orderSumEl.textContent = `итого: ${sum} ₽`;

  // Если корзина пустая
  if(order.length === 0){
    document.querySelector('.order__list').innerHTML = `<li style="padding: 5px">нет выбранных товаров в корзине</li>`;
  } else {
    // если корзина не пустая — пересобираем индексы
    const orderItems = document.querySelectorAll('.order__item');
    orderItems.forEach((item, i) => item.dataset.index = i);
  }
});

// Показ корзины по клику
function renderOrderClick() {
  const headerCartWrap = document.querySelector('.header__cart-wrap');
  headerCartWrap.addEventListener('click', () => renderOrder(navItems, productCardsList));
}

// Сохранение позиции скролла при прокрутке
window.addEventListener('scroll', () => {
  localStorage.setItem('scrollPosition', window.scrollY);
});

// Инициализация страницы
document.addEventListener('DOMContentLoaded', async () => {
  const isFirstLoad = !localStorage.getItem('scrollPosition');

  const cardsArray = await loadCards();
  await renderContacts();
  categoriesFilter(navItems, productCardsList, cardsArray);
  searchCards(searchBtn, productCardsList, navItems); 
  renderOrderClick();
  showAboutInfo(productCardsTitle, contactsItem, productCardsList);

  const hash = window.location.hash.replace('#', '');
  if (hash === 'about') {
    renderAbout(productCardsTitle, productCardsList);
    return; // выходим, карточки не рендерим
  }

  const loadCategory = localStorage.getItem('category');
  if(!loadCategory) {
    navItems[0].classList.add('nav__item-active');
    renderProductCards('rods', productCardsList, cardsArray);
    showCardDetails(productCardsList, cardsArray, cart, navItems, productCardsTitle);
  } else if(loadCategory === 'cart') {
    renderOrder(navItems, productCardsList);
  } else {
    renderProductCards(loadCategory, productCardsList, cardsArray);
    showCardDetails(productCardsList, cardsArray, cart, navItems, productCardsTitle);
    const navActive = localStorage.getItem('nav-active');
    if(navActive) navItems[navActive].classList.add('nav__item-active');
  }

  // Скролл наверх при первой загрузке
  if (isFirstLoad) {
    window.scrollTo(0, 0);
  }
});

// Восстановление скролла после полной загрузки
window.addEventListener('load', () => {
  const isFirstLoad = !localStorage.getItem('scrollPosition');
  if (!isFirstLoad) {
    const scrollPosition = parseInt(localStorage.getItem('scrollPosition'), 10) || 0;
    window.scrollTo(0, scrollPosition);
  }
});

// === Обработка изменения хеша ===
