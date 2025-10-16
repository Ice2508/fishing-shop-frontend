







export default async function renderSales(actionsSettings, cards) {
    try {
        const strHtml = cards.map(card => {
            return `<li class="actions__cards-item"><span class="actions__cards-wrap actions__cards-wrap--sales"><strong>${card.title}:</strong>
                    <span><b>${card.price} ₽</b></span></span>
                    <button class="actions__cards-sales" data-id="${card.documentId}">${card.isActive ? 'закрыть' : 'открыть'}</button></li>`;
        }).join('');
        actionsSettings.innerHTML = `
           <ul class="actions__cards-list">${strHtml}</ul>
           <div class="actions__pagination-wrap">
              <button class="actions__pagination">&#8656; предыдущая</button>
              <button class="actions__pagination">следующая &#8658;</button>
           </div>
        `;
        const salesBtn = document.querySelectorAll('.actions__cards-sales');
        salesBtn.forEach(btn => {
            btn.addEventListener('click', async () => {
                let currentValue;
                const id = btn.dataset.id;
                if(btn.textContent === 'открыть') {
                    currentValue = false;
                } else {
                    currentValue = true;
                }
              const res = await salesApi(currentValue, id, cards);
              console.log(res.data.isActive)
              btn.textContent = res.data.isActive === true ? 'закрыть' : 'открыть';
              
            })
        })
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

    const response = await fetch(`http://localhost:1337/api/prods/${id}?populate=productImg`, {
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