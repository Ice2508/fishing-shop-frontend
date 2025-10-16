






import contactsApi from '../api/contactsApi.js';

export function renderContacts(actionsSettings) {
  actionsSettings.innerHTML = `
    <form class="actions__form-contacts">
      <div class="actions__inp-phone-wrap">
        <div class="actions__inp-wrap">
          <label for="num1" class="actions__label-contacts">Контактный номер 1</label>
          <input id="num1" class="actions__inp-contacts actions__inp-contacts--phone" type="phone">
        </div>
        <div class="actions__inp-wrap">
          <label for="num2" class="actions__label-contacts">Контактный номер 2</label>
          <input id="num2" class="actions__inp-contacts actions__inp-contacts--phone" type="phone">
        </div>
      </div>
      <div class="actions__inp-wrap">
        <label for="email" class="actions__label-contacts">Контактный email</label>
        <input id="email" class="actions__inp-contacts" type="email">
      </div>
      <div class="actions__btn-wrap">
        <button class="actions__btn actions__btn--close" type="button">Отмена</button>
        <button class="actions__btn actions__btn--contacts" type="submit">Сохранить</button>
      </div>
    </form>
  `;

  const form = actionsSettings.querySelector('form');
  const inputs = form.querySelectorAll('.actions__inp-contacts');
  const btnClose = form.querySelector('.actions__btn--close');
  const btnSave = form.querySelector('.actions__btn--contacts');

  return { form, phone1: inputs[0], phone2: inputs[1], email: inputs[2], btnClose, btnSave, inputs };
}

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
    }
  });
}