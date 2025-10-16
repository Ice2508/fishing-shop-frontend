import BASE_URL from './config.js';

export default async function cardsDeleteApi(cardId) {
    
    const response = await fetch(`${BASE_URL}/api/prods/${cardId}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
    });
    if (response.status === 204) {
        return true; 
    } else {
        throw new Error(`Ошибка при удалении карточки: ${response.status}`);
    }
}