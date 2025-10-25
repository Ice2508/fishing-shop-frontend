import { variantsBtnState } from './showCardDetails.js';

export default async function renderProductCards(category, productCardsList, cardsArray) {
  const productHtml = cardsArray
    .filter(el => (!category || el.category === category) && el.isActive)
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(el => {
      const imgUrl = el.productImg?.formats?.thumbnail?.url
      ? el.productImg.formats.thumbnail.url
      : el.productImg?.url || '';
      // рендерим варианты
      let strVariants = '';
      if (Array.isArray(el.variants) && el.variants.length > 0) {
        strVariants = el.variants.map(variant => (
          `<button type="button" class="product-cards__show-details-variant-btn">${variant}</button>`
        )).join('');
      }

      return `
        <div class="product-cards__item" data-id="${el.id}">
          <div class="product-cards__item-popup-variants">
            <div class="product-cards__item-popup-variants-info">${strVariants}</div>
            <div class="product-cards__item-popup-variants-btn">
                <button class="product-cards__btn">в корзину</button>
            </div>    
          </div>
          <img class="product-cards__img" src="${imgUrl}" alt="${el.productImg?.alternativeText || el.title}">
          <div class="product-cards__wrap">
            <h2 class="product-cards__name">${el.title}</h2>
            <div class="product-cards__price-wrap">
              <p class="product-cards__price"><span>${el.price ?? 0} ₽</span></p>
              <button class="product-cards__btn">в корзину</button>
            </div>
          </div>
        </div>`;
    }).join('');

  document.querySelector('.product-cards__title').textContent = "Каталог товаров";
  productCardsList.innerHTML = productHtml;

  const variantBtn = document.querySelectorAll('.product-cards__show-details-variant-btn');
  variantsBtnState(variantBtn);
}
