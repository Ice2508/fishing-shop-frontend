import switchTab from './switchTab.js';

export default async function checkTokenExpiration(popupOverlay, adminDashboardItems, titleElement, actionsEl) {
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  const twoMinutesInMs = 2 * 60 * 1000;
  
  if (tokenTimestamp && Date.now() - parseInt(tokenTimestamp, 10) > twoMinutesInMs) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    popupOverlay.classList.remove('popup__auth-ok');
    popupOverlay.style.opacity = '1';
    await switchTab('add', adminDashboardItems, titleElement, actionsEl);
  }
}
