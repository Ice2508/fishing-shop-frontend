import getContactsApi from '../api/getContactsApi.js';

export default async function renderContacts() {
  const contacts = await getContactsApi();
  const [c1, c2, c3, c4, c5] = document.querySelectorAll('.header__contact');
  c1.textContent = `☎ ${contacts.phone1}`;
  c2.textContent = `☎ ${contacts.phone2}`;
  c3.textContent = `☎ ${contacts.phone1}`;
  c4.textContent = `☎ ${contacts.phone2}`;
  c5.textContent = `✉ ${contacts.email}`;
}