export function renderAbout(productCardsTitle, productCardsList) {
  window.scrollTo(0, 240);
  productCardsList.innerHTML = `<section class="about">
    <div class="about__img-wrap">
      <img class="about__img" src="img/fon-about.webp">
    </div>
    <div class="about__info">
      <p>Мы — команда увлечённых рыболовов...</p>
      <p>Наша цель — сделать рыбалку доступной...</p>
      <p>С нами вы всегда будете готовы к новым рыболовным приключениям...</p>
      <p><strong>Добро пожаловать в наш мир рыбалки! 🌊</strong></p>
    </div>
  </section>`;
  productCardsTitle.innerHTML = 'о нас';
}

export function showAboutInfo(productCardsTitle, contactsItem, productCardsList) {
  contactsItem[0].addEventListener('click', () => {
    window.location.hash = 'about';
    renderAbout(productCardsTitle, productCardsList);
  });
}