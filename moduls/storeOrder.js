




import animateCart from './animateCart.js';
import countCart from './countCart.js';

export default function storeOrder(productCardsList, cart) {
  productCardsList.addEventListener('click', (e) => {
    if (!e.target.classList.contains('product-cards__btn')) return;

    e.stopImmediatePropagation();

    const btn = e.target;
    const card = btn.closest('.product-cards__item, .product-cards__show-details');
    if (!card) return;

    if (card.classList.contains('product-cards__item')) {
      const popup = card.querySelector('.product-cards__item-popup-variants');
      if (
        card.querySelector('.product-cards__show-details-variant-btn') &&
        !btn.closest('.product-cards__item-popup-variants')
      ) {
        if (popup) {
          popup.classList.add('product-cards__item-popup-variants--active');
        }

        // 🔹 показываем блокер
        const blocker = document.querySelector('.page-blocker');
        if (blocker) {
          blocker.style.display = 'block';
        }

        const firstVariantBtn = popup.querySelector('.product-cards__show-details-variant-btn');
        if (firstVariantBtn) {
          firstVariantBtn.classList.add('product-cards__show-details-variant-btn--active');
          localStorage.setItem('variant', firstVariantBtn.textContent.trim());
        }
        return;
      }
    }

    const priceEl = card.querySelector('.product-cards__price span');
    const price = priceEl ? priceEl.textContent.trim() : '0';

    let nameEl = card.querySelector('.product-cards__name');
    if (!nameEl) {
      nameEl = document.querySelector('.product-cards__title');
    }
    const name = nameEl ? nameEl.textContent.trim() : 'Без названия';

    let variant = localStorage.getItem('variant');
    if (!variant) variant = '';

    const arrOrder = JSON.parse(localStorage.getItem('order')) || [];
    arrOrder.push({ name, price, variant });
    localStorage.setItem('order', JSON.stringify(arrOrder));

    console.log('Товар добавлен в корзину:', { name, price });
    countCart();
    const popupParent = btn.closest('.product-cards__item-popup-variants');
    if (popupParent) {
      setTimeout(() => {
        popupParent.classList.remove('product-cards__item-popup-variants--active');

        const blocker = document.querySelector('.page-blocker');
        if (blocker) blocker.style.display = 'none';

        const activeVariant = popupParent.querySelector('.product-cards__show-details-variant-btn--active');
        if (activeVariant) {
          activeVariant.classList.remove('product-cards__show-details-variant-btn--active');
        }
      }, 500);

      localStorage.removeItem('variant');
    }

    btn.classList.add('btn-clicked');
    setTimeout(() => btn.classList.remove('btn-clicked'), 200);

    animateCart(cart);
  });

  // 🔹 Добавляем обработчик на маску
  const blocker = document.querySelector('.page-blocker');
  if (blocker) {
    blocker.addEventListener('click', (e) => {
      // если клик был не по попапу — закрываем
      if (!e.target.closest('.product-cards__item-popup-variants')) {
        blocker.style.display = 'none';

        const activePopup = document.querySelector('.product-cards__item-popup-variants--active');
        if (activePopup) {
          activePopup.classList.remove('product-cards__item-popup-variants--active');
        }

        const activeVariant = document.querySelector('.product-cards__show-details-variant-btn--active');
        if (activeVariant) {
          activeVariant.classList.remove('product-cards__show-details-variant-btn--active');
        }

        localStorage.removeItem('variant');
      }
    });
  }
}