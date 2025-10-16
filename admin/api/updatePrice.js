import BASE_URL from './config.js';

export default async function updatePrice(priceId, newPrice) {
    try {
        const cards = JSON.parse(localStorage.getItem('productList'));
        const card = cards.find(c => c.documentId === priceId);
        if (!card) throw new Error('Карточка не найдена');
        const response = await fetch(`${BASE_URL}/api/prods/${priceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                data: {
                    price: newPrice,
                    productImg: card.productImg?.id ?? null
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка при обновлении цены ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка в updatePrice', error);
        throw error;
    }
}
