'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

const showModal = () => {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const hideModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', showModal);

btnCloseModal.addEventListener('click', hideModal);
overlay.addEventListener('click', hideModal);
