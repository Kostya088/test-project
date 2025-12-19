import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import { getStories } from './success-stories-api';
import { renderStories } from './success-stories-render';
import { showInfo } from './toast-util.js';

const loader = document.querySelector('.stories-loader');
const controls = document.querySelector(
  '.success-stories-section .swiper-controls'
);

function showError(error) {
  showInfo(error, {
    color: '#f2aaaaff',
    icon: false,
    progressBar: false,
    messageColor: 'black',
  });
}

function hideLoader() {
  loader.classList.remove('loader');
}

function showLoader() {
  loader.classList.add('loader');
}

function hideControls() {
  controls.classList.add('visually-hidden');
}

function showControls() {
  controls.classList.remove('visually-hidden');
}

window.addEventListener('DOMContentLoaded', async () => {
  try {
    let storiesList = await getStories();

    if (storiesList === null) {
      showError('Не вдалося завантажити історії. Спробуйте пізніше');
      hideLoader();
      const wrapper = document.querySelector(
        '.success-stories-section .swiper-wrapper'
      );
      if (wrapper) {
        wrapper.innerHTML =
          '<p class="error-swiper">Не вдалося завантажити історії</p>';
      }
      return;
    }

    if (storiesList.length === 0) {
      showError('Нажаль, історії зараз недоступні');
      hideLoader();
      const wrapper = document.querySelector(
        '.success-stories-section .swiper-wrapper'
      );
      if (wrapper) {
        wrapper.innerHTML =
          '<p class="error-swiper">Нажаль, історії зараз недоступні</p>';
      }
      return;
    }

    renderStories(storiesList);

    const swiper = new Swiper('.success-stories-section .swiper', {
      modules: [Navigation, Pagination],
      direction: 'horizontal',
      loop: false,
      speed: 400,
      spaceBetween: 32,

      pagination: {
        el: '.success-stories-section .swiper-pagination',
        clickable: true,
        dynamicBullets: false,
      },

      navigation: {
        nextEl: '.success-stories-section .swiper-button-next',
        prevEl: '.success-stories-section .swiper-button-prev',
      },

      breakpoints: {
        768: {
          slidesPerView: 2,
        },
      },
    });

    showControls();
    hideLoader();
  } catch (err) {
    showError('Cталась помилка. Спробуйте пізніше');
    const wrapper = document.querySelector(
      '.success-stories-section .swiper-wrapper'
    );
    if (wrapper) {
      wrapper.innerHTML =
        '<p class="error-swiper">Нажаль, історії зараз недоступні</p>';
    }
    hideLoader();
  }
});
