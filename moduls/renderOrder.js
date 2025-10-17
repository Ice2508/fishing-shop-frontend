import orderApi from '../api/orderApi.js';
import loadCards from '../api/loadCardsApi.js';
import { loaderOn, loaderOff } from '../adimin/moduls/loader.js'; 

export default async function renderOrder(navItems, productCardsList) {
  const loader = document.querySelector('.loader-wrap');
  loaderOn(loader); // включаем loader

  const order = JSON.parse(localStorage.getItem('order')) || [];
  window.location.hash = 'cart';
  localStorage.setItem('category', 'cart');
  navItems.forEach(el => el.classList.remove('nav__item-active'));
  document.querySelector('.product-cards__title').textContent = "Ваш заказ";

  // Загружаем данные из API
  let apiCards = [];
  try {
    apiCards = await loadCards();
  } catch (error) {
    console.error('Ошибка загрузки данных из API:', error);
  }

  const apiMap = new Map(apiCards.map(card => [card.title, { price: card.price, isActive: card.isActive }]));

  const updatedOrder = order.map(el => {
    const apiItem = apiMap.get(el.name);
    return {
      name: el.name,
      price: apiItem && apiItem.isActive ? `${apiItem.price} ₽` : null,
      isAvailable: apiItem && apiItem.isActive
    };
  });

  const unavailableItems = updatedOrder.filter(el => !el.isAvailable).map(el => el.name);
  const sum = updatedOrder.filter(el => el.isAvailable).reduce((acc, el) => acc + parseInt(el.price, 10), 0);

  const orderHTML = updatedOrder.length === 0
    ? `<li style="padding: 5px">нет выбранных товаров в корзине</li>`
    : updatedOrder.map((el, i) => {
        const displayName = el.isAvailable ? el.name : `<span style="color:grey">${el.name} (Нет в наличии)</span>`;
        const displayPrice = el.isAvailable ? el.price : '';
        return `<li class="order__item" data-index=${i}>
                  <span class="order__name">${displayName}</span>
                  <span class="order__price">${displayPrice}</span>
                  <span class="order__close">&times;</span>
                </li>`;
      }).join('');

  productCardsList.innerHTML = `<section class="order">
    <ul class="order__list">${orderHTML}</ul>
    <div class="order__wrap">
      <div>
        <label for="adr" class="order__label">адрес доставки</label>
        <input class="order__input order__input--adress" id="adr" type="text" placeholder="адрес">
      </div>
      <div>
        <label for="phone" class="order__label">номер телефона</label>
        <input class="order__input order__input--phone" id="phone" type="number" placeholder="номер телефона">
      </div>
      <div class="order__submit">
        <p class="order__sum">итого: ${sum} ₽</p>
        <button class="order__btn order__btn--submit">Оформить заказ</button>
      </div>
    </div>
  </section>`;

  const addressInput = document.querySelector('.order__input--adress');
  const phoneInput = document.querySelector('.order__input--phone');
  const btnSubmit = document.querySelector('.order__btn');

  function updateButtonState() {
    const order = JSON.parse(localStorage.getItem('order')) || [];
    const isActive = addressInput.value.trim() && phoneInput.value.trim() && order.length > 0;
    btnSubmit.disabled = !isActive;
    btnSubmit.style.opacity = isActive ? '1' : '0.6';
    btnSubmit.style.cursor = isActive ? 'pointer' : 'not-allowed';
  }

  updateButtonState();
  addressInput.addEventListener('input', updateButtonState);
  phoneInput.addEventListener('input', updateButtonState);

  orderSubmit(btnSubmit, productCardsList);

  loaderOff(loader); // выключаем loader после полной отрисовки
}

function orderSubmit(btnSubmit, productCardsList) {
  btnSubmit.addEventListener('click', async () => {
    const order = JSON.parse(localStorage.getItem('order')) || [];
    const address = document.querySelector('.order__input--adress').value.trim();
    const phone = document.querySelector('.order__input--phone').value.trim();
    if (!address || !phone || order.length === 0) return;

    try {
      const res = await orderApi(order, address, phone);
      localStorage.removeItem('order');
      productCardsList.innerHTML = `<section class="order">
        <div class="order__ok">
          <p><strong>Заказ №${res.data.id} успешно оформлен✅</strong></p>
          <p>Обязательно укажите при оплате номер заказа!!!</p>
          <p><img src="img/vtb.png" alt="втб"><span>2234 5456 4233 3545</span></p>
          <p><img src="img/psb.png" alt="псб"><span>2455 4336 3434 2325</span></p>
        </div>
      </section>`;
      console.log(res.data.id);
    } catch (error) {
      productCardsList.innerHTML = `<section class="order"><p>Заказ не удалось оформить❌</p></section>`;
      console.error(error);
    }
  });
}