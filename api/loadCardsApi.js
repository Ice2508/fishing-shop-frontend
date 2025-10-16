import BASE_URL from './config.js';
import { loaderOn, loaderOff } from '../admin/moduls/loader.js';


export default async function loadCards() {
   const loaderWrap = document.querySelector('.loader-wrap');
   try {
     loaderOn(loaderWrap); 
     const response = await fetch(`${BASE_URL}/api/prods?populate=productImg&pagination[pageSize]=500`);
     if (!response.ok) {
      console.error('карточки товаров не получены от сервера!!!');
      return;
     }
     const cards = await response.json(); 
     localStorage.setItem('totalCard', cards.meta.pagination.total);
     console.log(cards.data);
     return cards.data.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
   } finally {
      loaderOff(loaderWrap);
   }
}