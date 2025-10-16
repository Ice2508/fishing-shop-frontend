import switchTab from './switchTab.js';
import { authUser } from '../api/authApi.js';

export default function authAdmin(popupOverlay, adminDashboardItems, titleElement, actionsEl) {
  const popupBtn = document.querySelectorAll('.popup__btn');
  const popupInput = document.querySelectorAll('.popup__inp');
  const noAuthMsg = document.querySelector('.popup__no-auth');

  // Функция для динамического обновления scrollbar-gutter
  const updateScrollbarGutter = () => {
    document.documentElement.style.scrollbarGutter = window.innerWidth > 620 ? 'stable' : 'auto';
  };

  // Слушатель изменения размера окна
  window.addEventListener('resize', updateScrollbarGutter);

  popupBtn[0].addEventListener('click', () => {
    window.location.href = 'https://ice2508.github.io/fishing-shop-frontend';
  });

  popupBtn[1].addEventListener('click', async () => {
    const login = popupInput[0].value;
    const password = popupInput[1].value;

    try {
      await authUser(login, password);
      popupOverlay.classList.add('popup__auth-ok');
      updateScrollbarGutter(); // сразу после авторизации
      switchTab('add', adminDashboardItems, titleElement, actionsEl);
    } catch (error) {
      noAuthMsg.style.opacity = '1';
      setTimeout(() => {
        noAuthMsg.style.opacity = '0';
      }, 3000);
    }
  });

  const token = localStorage.getItem('token');
  if (token) {
    popupOverlay.classList.add('popup__auth-ok');
    updateScrollbarGutter(); 
  }
}