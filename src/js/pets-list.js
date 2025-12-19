import { showError, showInfo } from './toast-util.js';
import { getImagesByQuery, getCategoryByQuery } from './pets-list-api.js';
import {
  createCategoryList,
  createPetsList,
  clearPetsList,
  showLoader,
  hideLoader,
  showMorePetsButton,
  hideMorePetsButton,
  scrollPetsList,
  morePetsButton,
} from './pets-list-render.js';

let page = 1;
let categoryId = '';
let petsObjArray = [];
const petsById = new Map();
const petsList = document.querySelector('.pets-list');
const petsCategoryList = document.querySelector('.pets-category-list');
const firstCategoryButton = document.querySelector('.pet-category-button.all');
firstCategoryButton.classList.add('is-deactive');

getCategoryByQueryMaker();
getImagesByQueryMaker(categoryId, page);

petsCategoryList.addEventListener('click', e => {
  const button = e.target.closest('.pet-category-button');
  if (!button) return;
  const deactiveButton = petsCategoryList.querySelector(
    '.pet-category-button.is-deactive'
  );
  if (deactiveButton) deactiveButton.classList.remove('is-deactive');
  button.classList.add('is-deactive');
  categoryId = button.dataset.categoryId || '';
  page = 1;
  hideMorePetsButton();
  clearPetsList();
  showLoader();
  getImagesByQueryMaker(categoryId, page);
});

if (morePetsButton) {
  morePetsButton.addEventListener('click', event => {
    event.preventDefault();
    hideMorePetsButton();
    showLoader();
    page++;
    getImagesByQueryMaker(categoryId, page);
  });
}

petsList?.addEventListener('click', e => {
  const btn = e.target.closest('.pets-list-section .button-container');
  if (!btn) return;
  e.preventDefault();

  const petId = btn.dataset.id;

  window.dispatchEvent(
    new CustomEvent('open-animal-modal', {
      detail: { petId },
    })
  );
});

/* Функції */

/* Картки */
async function getImagesByQueryMaker(categoryId, page) {
  try {
    hideMorePetsButton();
    showLoader();

    const data = await getImagesByQuery(categoryId, page);
    const animals = data?.animals || [];

    if (animals.length === 0) {
      await showInfo('Тварин не знайдено за обраним фільтром.');
      clearPetsList();
      return;
    }

    if (page === 1) {
      petsObjArray = [];
      petsById.clear();
      clearPetsList();
    }

    const toRender = [];
    for (const pet of animals) {
      if (!petsById.has(pet._id)) {
        petsById.set(pet._id, pet);
        petsObjArray.push(pet);
        toRender.push(pet);
      } else {
        petsById.set(pet._id, pet);
      }
    }

    setPets(petsObjArray);
    createPetsList(toRender);

    if (page > 1) scrollPetsList();

    const totalPages = Math.ceil((data.totalItems || 0) / (data.limit || 1));

    if (page >= totalPages) {
      hideMorePetsButton();
      await showInfo('Ви переглянули всі доступні результати.');
    } else {
      showMorePetsButton();
    }
  } catch (error) {
    await showError(
      error?.message || 'Сталася помилка під час завантаження тварин.'
    );
  } finally {
    hideLoader();
  }
}

/* Категорії */

async function getCategoryByQueryMaker() {
  try {
    const data = await getCategoryByQuery();

    if (!Array.isArray(data) || data.length === 0) {
      await showInfo('Категорії не знайдено.');
      return;
    }

    petsObjArray = data;
    createCategoryList(petsObjArray);
  } catch (error) {
    await showError(
      error?.message || 'Сталася помилка під час завантаження категорій.'
    );
  } finally {
  }
}

/* функції для передачі данних для модалки*/

function setPets(data) {
  petsObjArray = Array.isArray(data) ? data : [];
}

export function getPets() {
  return petsObjArray;
}

export function getPetById(id) {
  return petsObjArray.find(p => p._id === id);
}
