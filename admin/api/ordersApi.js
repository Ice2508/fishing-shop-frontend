import BASE_URL from './config.js';

export async function trackSubmitApi(trackNumber, idCard) {
  const token = localStorage.getItem('token');
  const apiUrl = `${BASE_URL}/api/tracks`;

  // Сначала проверяем, есть ли запись с таким idCard
  const existingResponse = await fetch(`${apiUrl}?filters[order_number][$eq]=${idCard}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!existingResponse.ok) {
    const errorText = await existingResponse.text();
    throw new Error(`Ошибка при проверке существующей записи ${existingResponse.status}: ${errorText}`);
  }

  const existingData = await existingResponse.json();

  if (existingData.data && existingData.data.length > 0) {
    // Если запись есть, делаем PUT по documentId
    const existingDocumentId = existingData.data[0].documentId;

    const putResponse = await fetch(`${apiUrl}/${existingDocumentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          order_number: idCard,
          order_track: trackNumber
        }
      })
    });

    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      throw new Error(`Ошибка при обновлении ${putResponse.status}: ${errorText}`);
    }

    const updated = await putResponse.json();
    console.log('Обновлено:', updated);
    return updated;

  } else {
    // Если записи нет, делаем POST
    const postResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          order_number: idCard,
          order_track: trackNumber
        }
      })
    });

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      throw new Error(`Ошибка при создании ${postResponse.status}: ${errorText}`);
    }

    const created = await postResponse.json();
    console.log('Создано:', created);
    return created;
  }
}

export async function getTracksApi() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/api/tracks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${res.error?.message || 'Неизвестная ошибка'}`);
  }

  
  return res.data.map(item => ({
    order_number: item.order_number,
    order_track: item.order_track
  }));
  
}

export async function getOrdersApi(page = 1) {
    const response = await fetch(
        `${BASE_URL}/api/orders?pagination[page]=${page}&pagination[pageSize]=25&sort=createdAt:desc`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Ошибка при получении заказов: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('totalOrder', data.meta.pagination.total);
    console.log(data.data);
    return data.data;
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Токен авторизации отсутствует');
    console.log('Отправляемый запрос:', { orderId, newStatus });
    const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ data: { send_status: newStatus } })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    console.log(`Статус обновлен: ${newStatus}`, result);
    return result;
  } catch (error) {
    console.error('Ошибка в updateOrderStatus:', error);
    throw error;
  }
}
