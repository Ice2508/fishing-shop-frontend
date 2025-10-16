import BASE_URL from './config.js';

export async function authUser(login, password) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: login, password }),
    });

    if (!response.ok) throw new Error('Ошибка авторизации');

    const data = await response.json();
    const token = data.jwt;
    localStorage.setItem('token', token);
    localStorage.setItem('tokenTimestamp', Date.now().toString());

    return true; // Успешная авторизация
  } catch (error) {
    console.error(error);
    throw error; // Пробрасываем ошибку для обработки в вызывающем коде
  }
}