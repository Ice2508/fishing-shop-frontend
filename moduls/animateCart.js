export default function animateCart(cart) {
  cart.classList.add('swing');
  cart.addEventListener('animationend', () => {
    cart.classList.remove('swing');
  }, { once: true });
}