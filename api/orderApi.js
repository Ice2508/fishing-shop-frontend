import BASE_URL from './config.js';

export default async function orderApi(order, address, phone) {
  const token = localStorage.getItem('token');
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  const twoMinutesInMs = 2 * 60 * 1000;
  
  // Проверяем, истек ли токен, и удаляем его, если истек
  if (tokenTimestamp && Date.now() - parseInt(tokenTimestamp, 10) > twoMinutesInMs) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
  }

  const headers = {
    'Content-Type': 'application/json',
  };
  if (token && !(tokenTimestamp && Date.now() - parseInt(tokenTimestamp, 10) > twoMinutesInMs)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      data: {
        name: order,
        address: address,
        phone: phone,
      },
    }),
  });

  const result = await response.json();
  console.log(result);
  if (!response.ok) {
    throw new Error(`Ошибка при создании заказа: ${response.status}`);
  }
  return result;
}