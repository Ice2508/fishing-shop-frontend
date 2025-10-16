import BASE_URL from './config.js';

export default async function getContactsApi() {
  const response = await fetch(`${BASE_URL}/api/contact`);
  const data = await response.json();
  return data.data;
}