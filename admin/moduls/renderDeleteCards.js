
'use strict'


import cardsDeleteApi from '../api/cardsDeleteApi.js';
import loadCards from '../../api/loadCardsApi.js';

 async function setupDeleteCardHandlers(cards) {
	const cardsBtnRemove = document.querySelectorAll('.actions__cards-remove');
    cardsBtnRemove.forEach((btn, i) => {
        btn.addEventListener('click', async () => {
        	const cardId = cards[i].documentId;
            const deleteCards = await cardsDeleteApi(cardId);
            console.log(deleteCards);
            if(deleteCards) {
               btn.closest('li').remove();
               const updatedCards = await loadCards();
               localStorage.setItem('productList', JSON.stringify(updatedCards)); 
            }
        });
    });
}


export default  async function renderDeleteCards(cards, actionsSettings) {
    const strHtml = cards.map(card => {
        return `<li class="actions__cards-item"><span class="actions__cards-wrap"><strong>${card.title}:</strong>
                <span><b>${card.price} ₽</b></span></span>
                <button class="actions__cards-remove">&times;</button></li>`;
    }).join('');
    actionsSettings.innerHTML = `
    <ul class="actions__cards-list">${strHtml}</ul>
    <div class="actions__pagination-wrap">
        <button class="actions__pagination">&#8656; предыдущая</button>
        <button class="actions__pagination">следующая &#8658;</button>
    </div>
    `;
    const paginationBtn = document.querySelectorAll('.actions__pagination');
    if (cards.length < 26) {
         paginationBtn[0].classList.add('actions__pagination-disabled');
         paginationBtn[1].classList.add('actions__pagination-disabled');
    }
    setupDeleteCardHandlers(cards);
}