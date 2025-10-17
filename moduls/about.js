export function renderAbout(productCardsTitle, productCardsList, navItems) {
  productCardsList.innerHTML = `<section class="about">
    <div class="about__img-wrap">
      <img class="about__img" src="img/fon-about.webp">
    </div>
    <div class="about__info">
      <p>Мы — команда увлечённых рыболовов, для которых рыбалка — не просто хобби, а образ жизни. 
      Каждый из нас знает, что настоящая рыбалка начинается с правильного снаряжения. 
      Именно поэтому мы создали наш интернет-магазин — место, где каждый любитель и 
      профессионал найдёт всё необходимое для удачного улова.</p>
      <p>Наша цель — сделать рыбалку доступной, комфортной и по-настоящему вдохновляющей. 
      Мы тщательно подбираем ассортимент, тестируем снасти и оборудование, чтобы предложить 
      вам только проверенные товары, которым можно доверять в любых условиях.</p>
      <p>С нами вы всегда будете готовы к новым рыболовным приключениям, будь то утренний клёв на озере 
      или охота за трофейной щукой на реке.</p>
      <p><strong>Добро пожаловать в наш мир рыбалки! 🌊</strong></p>
    </div>
  </section>`;
  productCardsTitle.innerHTML = 'о нас';
  navItems.forEach(el => el.classList.remove('nav__item-active'));
}

export function showAboutInfo(productCardsTitle, contactsItem, productCardsList, navItems) {
  contactsItem[0].addEventListener('click', () => {
    window.scrollTo(0, 200);
    window.location.hash = 'about';
    renderAbout(productCardsTitle, productCardsList, navItems);
  });
}
