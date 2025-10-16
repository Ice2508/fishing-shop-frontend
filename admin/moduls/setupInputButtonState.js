/**
 * Универсальная функция для управления состоянием кнопки.
 * @param {HTMLInputElement[]} inputs - массив инпутов, за которыми нужно следить
 * @param {HTMLButtonElement} button - кнопка отправки
 */
export default function setupInputButtonState(inputs, button) {
  // Сохраняем оригинальные значения для сравнения
  inputs.forEach(input => {
    input.dataset.originalValue = input.value.trim();
  });

  // Функция обновления состояния кнопки
  const checkButtonState = () => {
    const shouldEnable = inputs.some(input => input.value.trim() !== '' && input.value.trim() !== input.dataset.originalValue);
    button.disabled = !shouldEnable;

    if (!shouldEnable) {
      button.style.opacity = '0.7';
      button.style.cursor = 'not-allowed';
    } else {
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  };

  checkButtonState(); // проверяем начальное состояние

  // Слушаем изменения в инпутах
  inputs.forEach(input => {
    input.addEventListener('input', checkButtonState);
  });
}