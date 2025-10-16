import renderProductCards from './renderProductCards.js';



export default function showCardDetails(productCardsList, cardsArray, cart, navItems, productCardsTitle) {
  productCardsList.addEventListener('click', (event) => {
    window.scrollTo(0, 240);
    const navActive = localStorage.getItem('nav-active');
    if (navActive) navItems[navActive].classList.remove('nav__item-active');
    const card = event.target.closest('.product-cards__item');
    if (!card) return; // клик вне карточки
    if (event.target.closest('.product-cards__btn')) return;
    const currentCategory = localStorage.getItem('category') || 'default';
    const scrollPosition = window.scrollY;
    sessionStorage.setItem('scroll-position', scrollPosition);
    localStorage.setItem('category', currentCategory);
    const cardId = card.dataset.id;
    const selectedCard = cardsArray.find(card => card.id === +cardId);
    const imgUrl = selectedCard.productImg?.formats?.medium?.url
        ? `http://localhost:1337${selectedCard.productImg.formats.thumbnail.url}`
        : `http://localhost:1337${selectedCard.productImg?.url ?? ''}`;
    
    console.log(imgUrl);
    console.log('Клик по карточке:', card);
    let characteristicsHtml = '';
    if (selectedCard.characteristics) {
        characteristicsHtml = selectedCard.characteristics.map(el => {
          return `<li>${el}</li>`;
        }).join('');
    }
    productCardsTitle.innerHTML = `${selectedCard.title}`;
    productCardsList.innerHTML = `
      <section class="product-cards__show-details">
        <button class="product-cards__show-details-close">&times;</button>
        <div class="product-cards__show-details-img">
          <img src=${imgUrl}>
        </div>
        <div class="product-cards__show-details-info">
          ${selectedCard.description}
          <h3 class="product-cards__show-details-title-list">Характеристики:</h3>
          <ul class="product-cards__show-details-list">${characteristicsHtml}</ul>
          <div class="product-cards__price-wrap product-cards__price-wrap--details">
            <p class="product-cards__price"><span>${selectedCard.price ?? 0} ₽</span></p>
            <button class="product-cards__btn product-cards__btn--details">в корзину</button>
          </div>
        </div>
      </section>
    `;
    // Выбираем кнопку закрытия после рендеринга
    const showDetailsClose = document.querySelector('.product-cards__show-details-close');
    if (showDetailsClose) {
      console.log('Кнопка закрытия найдена, привязываем обработчик');
      showCardDetailsClose(showDetailsClose, productCardsList, cardsArray, navItems, productCardsTitle);
    } else {
      console.error('Кнопка закрытия не найдена после рендеринга');
    }
  });
}

function showCardDetailsClose(showDetailsClose, productCardsList, cardsArray, navItems, productCardsTitle) {
  showDetailsClose.addEventListener('click', async () => {
    console.log('Клик по кнопке закрытия');
    const currentCategory = localStorage.getItem('category') || 'rods';
    console.log('Восстанавливаем категорию:', currentCategory);
    const navActive = localStorage.getItem('nav-active');
    if (navActive) {
      setTimeout(() => { navItems[navActive].classList.add('nav__item-active'); }, 0);
    }
    window.location.hash = currentCategory;
    console.log('Устанавливаем хэш:', currentCategory);
    await renderProductCards(currentCategory, productCardsList, cardsArray);
    console.log('Рендеринг карточек завершен для категории:', currentCategory);
    const scrollPosition = parseInt(sessionStorage.getItem('scroll-position'), 10) || 0;
    console.log('Восстанавливаем позицию скролла:', scrollPosition);
    document.documentElement.style.scrollBehavior = 'auto';
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 10);
  });
}