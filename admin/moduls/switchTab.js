









import { renderTabContent } from '../admin.js';




export default async function switchTab(tab, adminDashboardItems, titleElement, actionsEl) {
    updateTabUI(tab, adminDashboardItems, titleElement, actionsEl);
    saveTabState(tab);
    await renderTabContent(tab);
}

function updateTabUI(tab, adminDashboardItems, titleElement, actionsEl) {
    adminDashboardItems.forEach(btn => btn.classList.remove('admin-dashboard__item--active'));
    const btn = Array.from(adminDashboardItems).find(b => b.dataset.tab === tab);
    if (btn) {
        btn.classList.add('admin-dashboard__item--active');
        titleElement.textContent = btn.textContent.trim().toUpperCase();
    }
}

function saveTabState(tab) {
    sessionStorage.setItem('savedTab', tab);
}