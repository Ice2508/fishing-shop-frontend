







export default function countCart() {
	const order = JSON.parse(localStorage.getItem('order'));
    const countCartEl = document.querySelector('.header__cart-count');
    if ( order === null || order.length === 0 ) {
        countCartEl.style.opacity = '0';
    	return;
    }
    const count = +order.length;
    countCartEl.style.opacity = '1.0';
    countCartEl.textContent = count;
}