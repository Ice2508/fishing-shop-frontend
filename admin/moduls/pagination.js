













function getPageCount() {
    let total;
    if (sessionStorage.getItem('savedTab') === 'order') {    
        total = localStorage.getItem('totalOrder');
    } else {
        total = localStorage.getItem('totalCard');
    }

    const countPage = Math.ceil((+total || 0) / 25) || 1;
    console.log('--- getPageCount ---');
    console.log('Текущая вкладка:', sessionStorage.getItem('savedTab'));
    console.log('total:', total);
    console.log('countPage:', countPage);
    return countPage;
}

export function paginationFn(container, renderFns) {
    container.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('actions__pagination')) return;

        const countPage = getPageCount(); // Переносим расчет countPage внутрь обработчика
        let pagination = JSON.parse(localStorage.getItem('pagination')) || { delete: 1, toggleSales: 1, coast: 1, order: 1 };
        const tab = sessionStorage.getItem('savedTab');

        if (e.target.textContent.includes('следующая') && pagination[tab] < countPage) {
            pagination[tab]++;
        } else if (e.target.textContent.includes('предыдущая')) {
            if (pagination[tab] > 1) {
                pagination[tab]--;
            }
        }

        localStorage.setItem('pagination', JSON.stringify(pagination));
        const renderFn = renderFns[tab];
        if (renderFn) {
            await renderFn(container);
            updatePaginationButtons(container); 
        }
        
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const prevBtn = container.querySelector('.actions__pagination:first-child');
        const nextBtn = container.querySelector('.actions__pagination:last-child');

        // ставим disabled класс
        if (pagination[tab] <= 1) {
            prevBtn.classList.add('actions__pagination-disabled');
        } else {
            prevBtn.classList.remove('actions__pagination-disabled');
        }
        if (pagination[tab] >= countPage) {
            nextBtn.classList.add('actions__pagination-disabled');
        } else {
            nextBtn.classList.remove('actions__pagination-disabled');
        } 
    });
}

export function updatePaginationButtons(container) {
    const countPage = getPageCount();  
    const pagination = JSON.parse(localStorage.getItem('pagination'));
    const tab = sessionStorage.getItem('savedTab') || 'order';
    const prevBtn = container.querySelector('.actions__pagination:first-child');
    const nextBtn = container.querySelector('.actions__pagination:last-child');
    const paginationWrap = container.querySelector('.actions__pagination-wrap');
    if (!prevBtn || !nextBtn) return;

    if (pagination[tab] <= 1) {
        prevBtn.classList.add('actions__pagination-disabled');
    } else {
        prevBtn.classList.remove('actions__pagination-disabled');
    }
    
    if (pagination[tab] >= countPage) {
        nextBtn.classList.add('actions__pagination-disabled');
    } else {
        nextBtn.classList.remove('actions__pagination-disabled');
    }

    if (countPage === 1) {
        paginationWrap.style.display = 'none';
    }
}