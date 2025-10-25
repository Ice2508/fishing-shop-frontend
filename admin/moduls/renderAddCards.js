import addCardsApi from '../api/addCardsApi.js';
import loadCards from '../../api/loadCardsApi.js';
import setupInputButtonState from './setupInputButtonState.js';
import { loaderOn, loaderOff } from './loader.js'; // Import loader functions

export function renderAddCards(actionsSettings) {
  actionsSettings.innerHTML = `
    <form class="actions__form-add">
        <div class="actions__add-inp-wrap">
           <label for="title">Название товара</label>
           <input id="title" class="actions__inp-title" type="text" required>
        </div>  
        <textarea class="actions__descriptions" placeholder="описание товара" required></textarea>
        <div class="actions__characteristics-wrap">
           <div class="actions__characteristics-add">
              <input class="actions__characteristics-inp" placeholder="название характеристики: значение (например: Вес: 1 кг)">
              <button class="actions__characteristics-clear" type="button">очистить</button>
              <button class="actions__characteristics-btn" type="button">ввод</button>
           </div>
           <ul class="actions__characteristics-list"></ul>
          <div class="actions__add-inp-wrap actions__add-inp-wrap--variant"> 
             <label for="variants">Необязательное поле: укажите через запятую, например: 40,41,42 или красный, синий</label>
             <input id="variants" class="actions__variants-inp" placeholder="цвета, размеры и т.д., ">
          <div class="actions__add-inp-wrap">
        </div>
        <div class="actions__add-settings-wrap">
           <label for="price">Цена</label>
           <input id="price" class="actions__inp-price" type="number" step="any" required>
           <label for="inp-img" class="actions__label-img">фото товара</label>
           <input id="inp-img" class="actions__inp-img" type="file" required>
        </div>
        <div class="actions__categories-wrap">
            <span>Выберите категорию для товара</span>
            <div class="actions__inp-categories">
               <label class="actions__label-categories">
                 <input type="radio" name="gear" value="rods" required> 
                 <span class="actions__label-text">Удилища</span>
               </label>
               <label class="actions__label-categories">
                 <input type="radio" name="gear" value="reels">
                 <span class="actions__label-text">Приманка</span>
               </label>
               <label class="actions__label-categories">
                 <input type="radio" name="gear" value="lines"> 
                 <span class="actions__label-text">Снасти</span>
               </label>
               <label class="actions__label-categories">
                 <input type="radio" name="gear" value="equipment"> 
                 <span class="actions__label-text">Экипировка</span>
               </label>
               <label class="actions__label-categories">
                 <input type="radio" name="gear" value="accessories">
                 <span class="actions__label-text">Аксессуары</span>
               </label>
            </div>
        </div> 
        <div class="actions__add-settings-wrap actions__form-add-wrapper--btn">   
           <button class="actions__btn actions__btn--close" type="button">отмена</button>
           <button class="actions__btn actions__btn--add" type="submit">добавить</button>
        </div>
        <span class="actions__error-add"></span>
    </form>
  `;

  handleAddCharacteristic('.actions__characteristics-inp', '.actions__characteristics-btn', actionsSettings);
  updateCharacteristicsList(actionsSettings);

  const form = actionsSettings.querySelector('form');
  const titleInput = form.querySelector('.actions__inp-title');
  const descriptionInput = form.querySelector('.actions__descriptions');
  const priceInput = form.querySelector('.actions__inp-price');
  const imgInput = form.querySelector('.actions__inp-img');
  const categoryInput = form.querySelectorAll('input[name="gear"]');
  const btnAdd = form.querySelector('.actions__btn--add');
  const btnClose = form.querySelector('.actions__btn--close');
  const errorSpan = form.querySelector('.actions__error-add');
  const loader = document.querySelector('.loader-wrap'); 
  const variantsInput = form.querySelector('.actions__variants-inp');

  return { form, titleInput, descriptionInput, priceInput, imgInput, categoryInput, btnAdd, btnClose, errorSpan, loader, variantsInput };
}

function updateCharacteristicsList(actionsSettings) {
  const list = actionsSettings.querySelector('.actions__characteristics-list');
  const characteristics = JSON.parse(localStorage.getItem('characteristics')) || [];
  list.innerHTML = characteristics
    .map(el => `<li class="actions__characteristics-item">${el}</li>`)
    .join('');
}

export function setupAddFormHandlers(addForm) {
  const inputs = [addForm.titleInput, addForm.descriptionInput, addForm.priceInput];
  setupInputButtonState(inputs, addForm.btnAdd);

  const updateButtonState = () => {
    const allFilled = inputs.every(i => i.value.trim() !== '');
    const hasFile = addForm.imgInput.files.length > 0;
    const selectedRadio = Array.from(addForm.categoryInput).some(r => r.checked);
    const enableAdd = allFilled && hasFile && selectedRadio;

    addForm.btnAdd.disabled = !enableAdd;
    addForm.btnAdd.style.opacity = enableAdd ? '1' : '0.6';
    addForm.btnAdd.style.cursor = enableAdd ? 'pointer' : 'not-allowed';

    const allEmpty = inputs.every(i => i.value.trim() === '') && !hasFile && !selectedRadio;
    addForm.btnClose.style.opacity = allEmpty ? '0.6' : '1';
    addForm.btnClose.style.cursor = allEmpty ? 'not-allowed' : 'pointer';
  };

  inputs.forEach(i => i.addEventListener('input', updateButtonState));
  addForm.imgInput.addEventListener('change', updateButtonState);
  addForm.categoryInput.forEach(r => r.addEventListener('change', updateButtonState));

  addForm.btnAdd.addEventListener('click', async (event) => {
    event.preventDefault();

    const allFilled = inputs.every(i => i.value.trim() !== '');
    const hasFile = addForm.imgInput.files.length > 0;
    const selectedRadio = Array.from(addForm.categoryInput).find(r => r.checked)?.value;
    const characteristics = JSON.parse(localStorage.getItem('characteristics'));
    const variantsInputString = addForm.variantsInput.value;
    const variantsInputArray = variantsInputString
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
    loaderOn(addForm.loader); 
    try {
      const addResult = await addCardsApi(
        addForm.titleInput.value,
        addForm.descriptionInput.value,
        addForm.priceInput.value,
        selectedRadio,
        addForm.imgInput.files[0],
        characteristics,
        variantsInputArray 
      );
      localStorage.removeItem('characteristics');
      updateCharacteristicsList(addForm.form);

      if (addResult) {
        addForm.form.reset();
        updateButtonState();
      }

      const updatedCards = await loadCards();
      localStorage.setItem('productList', JSON.stringify(updatedCards));
    } catch {
      addForm.errorSpan.textContent = 'Ошибка добавления товара!!!';
      setTimeout(() => addForm.errorSpan.textContent = '', 2200);
    } finally {
      loaderOff(addForm.loader); // Hide loader
    }
  });

  updateButtonState();
}

export function handleAddCharacteristic(inputSelector, buttonSelector, actionsSettings) {
  const input = actionsSettings.querySelector(inputSelector);
  const button = actionsSettings.querySelector(buttonSelector);
  const clearBtn = actionsSettings.querySelector('.actions__characteristics-clear');

  // добавление характеристики
  button.addEventListener('click', () => {
    const value = input.value.trim();
    if (!value) return;

    const characteristics = JSON.parse(localStorage.getItem('characteristics')) || [];
    characteristics.push(value);
    localStorage.setItem('characteristics', JSON.stringify(characteristics));

    updateCharacteristicsList(actionsSettings);
    input.value = '';
  });

  // очистка характеристик
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('characteristics');
    const list = actionsSettings.querySelector('.actions__characteristics-list');
    list.innerHTML = '';
  });
}