import contactsApi from './api/contactsApi.js';
import addCardsApi from './api/addCardsApi.js';
import { renderAddCards, setupAddFormHandlers } from './moduls/renderAddCards.js';
import { renderContacts, setupContactsFormHandlers } from './moduls/renderContacts.js';
import loadCards from '../api/loadCardsApi.js';
import cardsDeleteApi from './api/cardsDeleteApi.js';
import renderDeleteCards from './moduls/renderDeleteCards.js';
import renderSales from './moduls/renderSales.js';
import authAdmin from './moduls/authAdmin.js';
import switchTab from './moduls/switchTab.js';
import renderOrder from './moduls/renderOrder.js';
import renderPrice from './moduls/renderPrice.js';
import checkTokenExpiration from './moduls/checkTokenExpiration.js';
import { paginationFn, updatePaginationButtons } from './moduls/pagination.js';


export default document.querySelector('.loader-wrap');

const adminDashboardItems = document.querySelectorAll('.admin-dashboard__item');
const actionsEl = document.querySelector('.actions');
export const actionsSettings = document.querySelector('.actions__settings');
const titleElement = document.querySelector('.actions__current-action');
const popupBtn = document.querySelectorAll('.popup__btn');
const popupOverlay = document.querySelector('.popup__overlay');
const menuIcon = document.querySelector('.admin-dashboard__menu-icon');
const dashboardList = document.querySelector('.admin-dashboard__list');

let tokenCheckInterval;
/**
 * Периодическая проверка токена
 */

/**
 * Сбрасывает формы при клике на кнопку закрытия.
 */
function setupFormReset() {
    if (!actionsSettings) {
        console.error('Element actionsSettings not found');
        return;
    }
    actionsSettings.addEventListener('click', (event) => {
        if (event.target.classList.contains('actions__btn--close')) {
            event.preventDefault();
            const form = event.target.closest('form');
            if (form) form.reset();
        }
    }); 
}

/**
 * Переключает вкладку и рендерит её содержимое.
 * @param {string} tab - Идентификатор вкладки (data-tab).
 */

/**
 * Сохраняет текущую вкладку в localStorage.
 * @param {string} tab - Идентификатор вкладки (data-tab).
 */

/**
 * Рендерит содержимое вкладки.
 * @param {string} tab - Идентификатор вкладки (data-tab).
 */
export async function renderTabContent(tab) {
    try {
        let cards = JSON.parse(localStorage.getItem('productList'));
        if (tab === 'add') {
            const addForm = renderAddCards(actionsSettings);
            setupAddFormHandlers(addForm);
        } else if (tab === 'delete') {
            await renderDeleteCards(cards, actionsSettings);
            
            updatePaginationButtons(actionsSettings);
        } else if (tab === 'contacts') {
            const contacts = renderContacts(actionsSettings);
            setupContactsFormHandlers(contacts);
        } else if (tab === 'toggle-sales') {
            await renderSales(actionsSettings, cards);
            updatePaginationButtons(actionsSettings);
        } else if (tab === 'coast') {
            await renderPrice(actionsSettings, cards);
            
            updatePaginationButtons(actionsSettings);
        } else if (tab === 'order') {
            await renderOrder(actionsSettings);
            updatePaginationButtons(actionsSettings);
        }
    } catch (error) {
        console.error(`Ошибка при рендеринге вкладки ${tab}:`, error);
        const errorSpan = actionsSettings.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = 'Ошибка при загрузке содержимого. Попробуйте снова.';
            setTimeout(() => errorSpan.textContent = '', 2200);
        }
    }
}

function setupTabSwitching() {
    adminDashboardItems.forEach(btn => {
        btn.addEventListener('click', async () => {
            await switchTab(btn.dataset.tab, adminDashboardItems, titleElement, actionsEl);
        });
    });
}

function toggleMenu() {
    menuIcon.addEventListener('click', () => {
         dashboardList.classList.toggle('admin-dashboard__list--block');
    })
}


/**
 * Инициализация страницы.
 */
document.addEventListener('DOMContentLoaded', async () => {
  popupOverlay.style.opacity = '1';  

  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  const minutesInMs = 4 * 60 * 1000;
  
  if (tokenTimestamp && Date.now() - parseInt(tokenTimestamp, 10) > minutesInMs) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    popupOverlay.classList.remove('popup__auth-ok');
  }

  await authAdmin(popupOverlay, adminDashboardItems, titleElement, actionsEl);
  toggleMenu();

  try {
    const updatedCards = await loadCards();
    localStorage.setItem('productList', JSON.stringify(updatedCards));
    setupFormReset();
    setupTabSwitching();
    const savedTab = sessionStorage.getItem('savedTab') || adminDashboardItems[0].dataset.tab;
    await switchTab(savedTab, adminDashboardItems, titleElement, actionsEl);
    const renderFunctions = {
       order: async (container) => await renderOrder(container),
       delete: async (container) => {
          const cards = JSON.parse(localStorage.getItem('productList')) || [];
          await renderDeleteCards(cards, container);
        },
        coast: async (container) => {
        const cards = JSON.parse(localStorage.getItem('productList')) || [];
        await renderPrice(container, cards);
        },
        "toggle-sales": async (container) => {
        const cards = JSON.parse(localStorage.getItem('productList')) || [];
        await renderSales(container, cards);
        },
        add: async (container) => renderAddCards(container),
        contacts: async (container) => renderContacts(container)
        };
     paginationFn(actionsSettings, renderFunctions); 
    if (!localStorage.getItem('pagination')) {
       localStorage.setItem('pagination', JSON.stringify({
          delete: 1,
          'toggle-sales': 1,
          coast: 1,
          order: 1
        }));
    }

    // Запускаем периодическую проверку токена каждые 30 секунд
    tokenCheckInterval = setInterval(() => checkTokenExpiration(popupOverlay, adminDashboardItems, titleElement, actionsEl), 240000);
    
  } catch (error) {
    console.error('Ошибка при инициализации:', error);
    const errorSpan = actionsSettings.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = 'Ошибка при загрузке данных. Попробуйте снова.';
         setTimeout(() => errorSpan.textContent = '', 2200);
    }
  }
});