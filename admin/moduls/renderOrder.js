

import setupInputButtonState from './setupInputButtonState.js';
import { getOrdersApi, getTracksApi, trackSubmitApi, updateOrderStatus } from '../api/ordersApi.js';
import { paginationFn } from './pagination.js';

export default async function renderOrder(actionsSettings) {
  const pagination = JSON.parse(localStorage.getItem('pagination'));
  const orders = await getOrdersApi(pagination.order);
  console.log(orders);
  const statusArray = ['not_sent', 'sent', 'delivered', 'returned', 'canceled'];
  const statusDisplayMap = {
    not_sent: 'Не отправлен 📦',
    sent: 'Отправлен 🚚',
    delivered: 'Доставлен ✅',
    returned: 'Возвращен 🔙',
    canceled: 'Отменен ❌'
  };

  actionsSettings.innerHTML = `
    <section class="actions__order">
      ${orders.map(order => {
        const products = (order.items || order.name.map(i => ({
          name: i.name,
          price: i.price ? i.price.replace(' ₽','') : 'нет цены'
      }))).map((item, index) => {
     const variant = order.name?.[index]?.variant;
     return {
      ...item,
    name: variant ? `${item.name} (${variant})` : item.name
    };
  });
        console.log(products);
        const total = products.reduce((sum, p) => sum + (isNaN(+p.price) ? 0 : +p.price), 0);
        return `<div class="actions__order-wrap" data-document-id="${order.documentId}">
          <div class="actions__order-title-wrap"><h3>Заказ №${order.id}</h3><button class="actions__order-btn">Изменить статус</button></div>
          <div class="actions__order-date">Дата: ${new Date(order.createdAt).toLocaleString()}</div>
          <div class="actions__order-contacts">
            <span>Телефон: ${order.phone}</span>
            <span>Адрес: ${order.address}</span>
            <div class="actions__order-track-wrap">
              <input class="actions__order-track" type="text" placeholder="трек номер">
              <button class="actions__order-track-btn">ok</button>
            </div>
          </div>
          <ol class="actions__order-list">
            ${products.map(p => `<li class="actions__order-item"><span>${p.name} </span><span>${p.price} ₽</span></li>`).join('')}
          </ol>
          <div class="actions__order-total">
            <strong>Итого: ${total} ₽</strong>
            <span class="actions__order-status" data-status="${order.send_status || 'not_sent'}">${statusDisplayMap[order.send_status || 'not_sent']}</span>
          </div>
        </div>`;
      }).join('')}
    
    </section>
      <div class="actions__pagination-wrap">
         <button class="actions__pagination">&#8656; предыдущая</button>
         <button class="actions__pagination">следующая &#8658;</button>
      </div>
  `;
    
    
    const container = actionsSettings.querySelector('.actions__order');

  // Функция обновления предупреждения ⚠️
  const updateWarning = (orderCard) => {
    const inp = orderCard.querySelector('.actions__order-track');
    const status = orderCard.querySelector('.actions__order-status').dataset.status;
    const title = orderCard.querySelector('.actions__order-title-wrap h3');
    const warning = title.querySelector('.warning-icon');

    if (!inp.value.trim() && status !== 'not_sent') {
      if (!warning) {
        const span = document.createElement('span');
        span.className = 'warning-icon';
        span.textContent = '⚠️ ';
        title.prepend(span);
      }
    } else if (warning) {
      warning.remove();
    }
  };

  const trackArr = await getTracksApi();
  const orderCards = container.querySelectorAll('.actions__order-wrap');

  orderCards.forEach(card => {
    const orderId = card.dataset.documentId;
    const inp = card.querySelector('.actions__order-track');
    const btn = card.querySelector('.actions__order-track-btn');
    if (!inp || !btn) return;

    // Устанавливаем значения треков с сервера
    const tracks = trackArr.filter(t => t.order_number === orderId).map(t => t.order_track);
    if (tracks.length > 0) inp.value = tracks.join(', ');

    // Настройка кнопки через универсальную функцию
    setupInputButtonState([inp], btn);

    // Изначальное обновление предупреждения
    updateWarning(card);
  });

  // Обновление предупреждения при вводе
  container.addEventListener('input', e => {
    if (e.target.classList.contains('actions__order-track')) {
      const card = e.target.closest('.actions__order-wrap');
      updateWarning(card);
    }
  });

  // Изменение статуса заказа
  container.querySelectorAll('.actions__order-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.actions__order-wrap');
      const statusEl = card.querySelector('.actions__order-status');
      const currentIndex = statusArray.indexOf(statusEl.dataset.status);
      const nextStatus = statusArray[(currentIndex + 1) % statusArray.length];

      try {
        await updateOrderStatus(card.dataset.documentId, nextStatus);
        statusEl.textContent = statusDisplayMap[nextStatus];
        statusEl.dataset.status = nextStatus;
        updateWarning(card);
      } catch (err) {
        console.error(err);
        alert('Не удалось изменить статус заказа');
      }
    });
  });

  // Отправка трек номера
  container.querySelectorAll('.actions__order-track-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      btn.classList.add('btn-clicked');
      setTimeout(() => btn.classList.remove('btn-clicked'), 200); 
      const card = btn.closest('.actions__order-wrap');
      const trackNumber = card.querySelector('.actions__order-track').value;
      const idCard = card.dataset.documentId;
      if (trackNumber.trim() === '' || btn.disabled) return; // не отправляем если пусто или кнопка неактивна
      await trackSubmitApi(trackNumber, idCard);
      updateWarning(card);
      // после успешной отправки блокируем кнопку снова
      setupInputButtonState([card.querySelector('.actions__order-track')], btn);
    });
  });
}
