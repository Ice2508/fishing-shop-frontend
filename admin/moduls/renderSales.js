import BASE_URL from '../api/config.js';
import { loaderOn, loaderOff } from './loader.js';


export default async function renderSales(actionsSettings, cards) {
  try {
    const strHtml = cards.map(card => {
      return `<li class="actions__cards-item">
                <span class="actions__cards-wrap actions__cards-wrap--sales">
                  <strong>${card.title}:</strong> 
                  <span><b>${card.price} ₽</b></span>
                </span>
                <button class="actions__cards-sales" data-id="${card.documentId}">
                  ${card.isActive ? 'закрыть' : 'открыть'}
                </button>
              </li>`;
    }).join('');

    actionsSettings.innerHTML = `<ul class="actions__cards-list">${strHtml}</ul>
      <div class="actions__pagination-wrap">
        <button class="actions__pagination">&#8656; предыдущая</button>
        <button class="actions__pagination">следующая &#8658;</button>
      </div>`;

    const loader = document.querySelector('.loader-wrap'); // assuming loader exists

    const salesBtn = document.querySelectorAll('.actions__cards-sales');
    salesBtn.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const currentValue = btn.textContent === 'открыть' ? false : true;

        loaderOn(loader); 
        try {
          const res = await salesApi(currentValue, id, cards);
          btn.textContent = res.data.isActive ? 'закрыть' : 'открыть';
        } catch (err) {
          console.error(err);
        } finally {
          loaderOff(loader); 
        }
      });
    });
  } catch (error) {
    console.error('Ошибка при рендеринге продаж:', error);
    const errorSpan = actionsSettings.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = 'Не удалось загрузить список продаж. Попробуйте снова.';
      setTimeout(() => errorSpan.textContent = '', 2200);
    }
  }
}

async function salesApi(currentValue, id, cards) {
  try {
    const card = cards.find(c => c.documentId === id);
    if (!card) throw new Error('Карточка не найдена');

    const body = {
      data: {
        title: card.title,
        description: card.description,
        price: card.price,
        category: card.category,
        isActive: !currentValue,
        productImg: card.productImg?.id ?? null
      }
    };

    const response = await fetch(`${BASE_URL}/api/prods/${id}?populate=productImg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Ошибка обновления');

    return await response.json();
  } catch (err) {
    console.error('Ошибка при salesApi:', err);
    throw err;
  }
}
