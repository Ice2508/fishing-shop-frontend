import BASE_URL from './config.js';

export default async function contactsApi(phone1, phone2, email) {
	const response = await fetch(`${BASE_URL}/api/contact`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
                data: { phone1, phone2, email } 
        })
    })
    if (!response.ok) {
        console.error('Ошибка обновления контактов:', response.statusText);
        return;
    }
    const data = await response.json();
    console.log(data);
}