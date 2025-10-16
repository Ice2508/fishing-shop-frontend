




import animateCart from './animateCart.js';

export default function storeOrder(productCardsList, cart) {
  productCardsList.addEventListener('click', (e) => {
    // проверяем, что клик именно по кнопке "в корзину"
    if (!e.target.classList.contains('product-cards__btn')) return;

    // предотвращаем срабатывание других обработчиков (например, showCardDetails)
    e.stopImmediatePropagation();

    const btn = e.target;

    // ищем карточку (в списке или в деталях)
    const card = btn.closest('.product-cards__item, .product-cards__show-details');
    if (!card) return;

    // находим цену
    const priceEl = card.querySelector('.product-cards__price span');
    const price = priceEl ? priceEl.textContent.trim() : '0';

    // находим имя товара
    let nameEl = card.querySelector('.product-cards__name');
    if (!nameEl) {
      nameEl = document.querySelector('.product-cards__title');
    }
    const name = nameEl ? nameEl.textContent.trim() : 'Без названия';

    // сохраняем заказ в localStorage
    const arrOrder = JSON.parse(localStorage.getItem('order')) || [];
    arrOrder.push({ name, price });
    localStorage.setItem('order', JSON.stringify(arrOrder));

    console.log('Товар добавлен в корзину:', { name, price });

    // анимация кнопки
    btn.classList.add('btn-clicked');
    setTimeout(() => btn.classList.remove('btn-clicked'), 200);

    // анимация корзины
    animateCart(cart);
  });
}