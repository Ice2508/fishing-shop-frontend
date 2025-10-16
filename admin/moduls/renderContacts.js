






import contactsApi from '../api/contactsApi.js';
import { loaderOn, loaderOff } from './loader.js'; // ← импорт загрузчика

export function setupContactsFormHandlers(contacts) {
  const updateButtonState = () => {
    const allFilled = Array.from(contacts.inputs).every(i => i.value.trim() !== '');
    const someFilled = Array.from(contacts.inputs).some(i => i.value.trim() !== '');

    contacts.btnSave.disabled = !allFilled;
    contacts.btnSave.style.opacity = allFilled ? '1' : '0.6';
    contacts.btnSave.style.cursor = allFilled ? 'pointer' : 'not-allowed';

    contacts.btnClose.style.opacity = someFilled ? '1' : '0.6';
    contacts.btnClose.style.cursor = someFilled ? 'pointer' : 'not-allowed';
  };

  contacts.inputs.forEach(i => i.addEventListener('input', updateButtonState));
  updateButtonState(); // начальное состояние

  contacts.btnSave.addEventListener('click', async (event) => {
    event.preventDefault();
    const allFilled = Array.from(contacts.inputs).every(i => i.value.trim() !== '');
    if (!allFilled) return;

    try {
      loaderOn(contacts.loader); // показать загрузчик
      await contactsApi(
        contacts.phone1.value,
        contacts.phone2.value,
        contacts.email.value
      );
      contacts.form.reset();
      updateButtonState();
    } catch (err) {
      console.error(err);
      alert('Не удалось изменить контакты!');
    } finally {
      loaderOff(contacts.loader); // скрыть загрузчик
    }
  });
}
