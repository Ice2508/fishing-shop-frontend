import updatePrice from '../api/updatePrice.js'; 
import setupInputButtonState from './setupInputButtonState.js';

export default function renderPrice(actionsSettings, cards) {
    try {
        const strHtml = cards.map(card => `
            <li class="actions__cards-item">
                <span class="actions__cards-wrap actions__cards-wrap--price">
                    <strong>${card.title}</strong>
                </span>
                <div>
                    <span>Цена:</span>
                    <input class="actions__price-inp" value="${card.price}">
                    <button class="actions__price-btn">ok</button>
                </div>
            </li>
        `).join('');

        actionsSettings.innerHTML = `<ul class="actions__cards-list">${strHtml}</ul>`;

        const priceInputs = actionsSettings.querySelectorAll('.actions__price-inp');
        const priceButtons = actionsSettings.querySelectorAll('.actions__price-btn');

        priceInputs.forEach((input, i) => {
            const btn = priceButtons[i];

            setupInputButtonState([input], btn);

            btn.addEventListener('click', async () => {
                const newPrice = input.value.trim();
                const priceId = cards[i].documentId;

                try {
                    await updatePrice(priceId, newPrice);

                    input.dataset.originalValue = newPrice;
                    btn.disabled = true;
                    btn.classList.add('is-disabled');
                } catch (error) {
                    console.error('Ошибка обновления цены:', error);
                    alert('Не удалось обновить цену. Попробуйте снова.');
                }
            });
        });
    } catch (error) {
        console.error('Ошибка при рендеринге цен:', error);
        const errorSpan = actionsSettings.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = 'Не удалось загрузить список товаров. Попробуйте снова.';
            setTimeout(() => errorSpan.textContent = '', 2200);
        }
    }
}
