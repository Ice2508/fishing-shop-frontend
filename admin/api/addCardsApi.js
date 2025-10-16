import BASE_URL from './config.js';

export default async function addCardsApi(actionsInpTitle, actionsDescription,  actionInpPrice, selectedRadio, actionInpImg, characteristics) {
	const response = await fetch(`${BASE_URL}/api/prods`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
        data: {
            title: actionsInpTitle, 
            description: actionsDescription, 
            price: actionInpPrice,
            category: selectedRadio,
            characteristics
            }
        })
    })
    if (!response.ok) throw new Error('Ошибка добавления товара');
    const data = await response.json();
    console.log(data);
    const productId = data.data.id;
    const formData = new FormData();
    formData.append('files', actionInpImg);
    formData.append('ref', 'api::prod.prod');  
    formData.append('refId', productId);       
    formData.append('field', 'productImg');   
    const uploadResponse = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
    })
    if (!uploadResponse.ok) {
        throw new Error('Ошибка загрузки изображения');
    }
    return true;
} 
                
