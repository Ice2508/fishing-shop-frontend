import switchTab from './switchTab.js';
import { authUser } from '../api/authApi.js';
import { loaderOn, loaderOff } from './loader.js'; // 

export default function authAdmin(popupOverlay, adminDashboardItems, titleElement, actionsEl) {
  const popupBtn = document.querySelectorAll('.popup__btn');
  const popupInput = document.querySelectorAll('.popup__inp');
  const noAuthMsg = document.querySelector('.popup__no-auth');
  const loader = document.querySelector('.loader-wrap'); 

  // 🔹 Динамическое обновление scrollbar-gutter
  const updateScrollbarGutter = () => {
    document.documentElement.style.scrollbarGutter = window.innerWidth > 620 ? 'stable' : 'auto';
  };

  window.addEventListener('resize', updateScrollbarGutter);

  // Кнопка "Назад" — возвращаемся на сайт
  popupBtn[0].addEventListener('click', () => {
    window.location.href = 'https://ice2508.github.io/fishing-shop-frontend';
  });

  // 🔹 Авторизация администратора
  popupBtn[1].addEventListener('click', async () => {
    const login = popupInput[0].value.trim();
    const password = popupInput[1].value.trim();

    if (!login || !password) {
      noAuthMsg.textContent = 'Введите логин и пароль!';
      noAuthMsg.style.opacity = '1';
      setTimeout(() => (noAuthMsg.style.opacity = '0'), 2500);
      return;
    }

    loaderOn(loader);

    try {
      await authUser(login, password);
      popupOverlay.classList.add('popup__auth-ok');
      updateScrollbarGutter();
      switchTab('add', adminDashboardItems, titleElement, actionsEl);
    } catch (error) {
      noAuthMsg.textContent = 'Неверный логин или пароль!';
      noAuthMsg.style.opacity = '1';
      setTimeout(() => (noAuthMsg.style.opacity = '0'), 3000);
    } finally {
      loaderOff(loader); 
    }
  });

  // 🔹 Если токен уже есть — сразу показываем админку
  const token = localStorage.getItem('token');
  if (token) {
    popupOverlay.classList.add('popup__auth-ok');
    updateScrollbarGutter();
  }
}
