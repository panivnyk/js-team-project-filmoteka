import filmCardTemplate from './hbs/modal-film-card.hbs';
import { getById } from './js/getById';
import axios from 'axios';
import { addEfectRenderer } from './js/effect_for_cart';
import { renderCollection } from './js/templates/movieTemplate';
import {
  checkLocalStorageOnwatch,
  checkLocalStorageOnQueue,
} from './js/localStorageApi';
import { loadingOn, loadingOff } from './js/loading';
import { openTeamModal, closeTeamModal } from './js/team-modal';

const refs = {
  watchedBtn: document.querySelector('.watched_btn'),
  queueBtn: document.querySelector('.queue_btn'),
  linkToTeam: document.querySelector('.footer__link'),
  moviesList: document.querySelector('.film__list'),
  /////////
  openFilmModal: document.querySelector('[data-modal-open]'),
  closeFilmModal: document.querySelector('[data-modal-close]'),
  closeFilmModalBtn: document.querySelector('[data-modal-close-btn]'),
  filmModal: document.querySelector('[data-film-modal]'),
  filmCard: document.querySelector('[data-film-card]'),
  modalFilm: document.querySelector('.modal-film'),
  addToWatchedBtn: document.querySelector('.modal-film'),
};

// ==============render info page================
function renderInfoPage() {
  refs.moviesList.innerHTML = '';
  const infoPage = document.createElement('strong');
  infoPage.classList.add('info-text');
  infoPage.innerHTML = `No movies selected <a class="info-text__link" href="./index.html">Add a movie</a>`;

  return refs.moviesList.append(infoPage);
}

function renderPage() {
  if (checkLocalStorageOnwatch()) {
    renderInfoPage();
  } else {
    const watchObj = JSON.parse(localStorage.getItem('watchedMovies'));
    refs.moviesList.innerHTML = '';
    for (let obj of watchObj) {
      renderCollection(obj);
      addEfectRenderer();
    }
  }
}

function clickOnWatchedBtn() {
  refs.watchedBtn.classList.add('current');
  refs.queueBtn.classList.remove('current');

  renderPage();
}

function clickOnQueueBtn() {
  refs.watchedBtn.classList.remove('current');
  refs.queueBtn.classList.add('current');

  if (checkLocalStorageOnQueue()) {
    renderInfoPage();
  } else {
    const queueObj = JSON.parse(localStorage.getItem('moviesInQueue'));
    refs.moviesList.innerHTML = '';

    for (let obj of queueObj) {
      renderCollection(obj);
      addEfectRenderer();
    }
  }
}

renderPage();

refs.watchedBtn.addEventListener('click', clickOnWatchedBtn);
refs.queueBtn.addEventListener('click', clickOnQueueBtn);
/////////
refs.openFilmModal.addEventListener('click', onCardClick);

const modalWindowRef = document.querySelector('.modal-film');

modalWindowRef.addEventListener('click', onModalWindowClick);

let watchedMovies = [];
let moviesInQueue = [];
let filteredWatchedMovies = [];
let filteredMoviesInQueue = [];

if (localStorage.getItem('watchedMovies') === null) {
  watchedMovies = [];
} else {
  watchedMovies = JSON.parse(localStorage.getItem('watchedMovies'));
}

if (localStorage.getItem('moviesInQueue') === null) {
  moviesInQueue = [];
} else {
  moviesInQueue = JSON.parse(localStorage.getItem('moviesInQueue'));
}

async function onModalWindowClick(evt) {
  const movieId = parseInt(evt.currentTarget.id);
  let movieObj = {};
  await getById(movieId).then(data => {
    movieObj = data;
  });

  const existWatchObj = watchedMovies.find(option => option.id === movieId);
  const existQueueObj = moviesInQueue.find(option => option.id === movieId);

  if (evt.target.id === 'watched') {
    if (existWatchObj === undefined) {
      evt.target.textContent = 'REMOVE FROM WATCHED';
      watchedMovies.push(movieObj);
    } else {
      evt.target.textContent = 'ADD TO WATCHED';
      watchedMovies.splice(watchedMovies.indexOf(existWatchObj), 1);
    }
  } else if (evt.target.id === 'queue') {
    if (existQueueObj === undefined) {
      evt.target.textContent = 'REMOVE FROM QUEUE';
      moviesInQueue.push(movieObj);
    } else {
      evt.target.textContent = 'ADD TO QUEUE';
      moviesInQueue.splice(moviesInQueue.indexOf(existQueueObj), 1);
    }
  }

  deleteWatchedMoviesDuplicates(watchedMovies);
  deleteMoviesInQueueDuplicates(moviesInQueue);

  localStorage.setItem('watchedMovies', JSON.stringify(filteredWatchedMovies));
  localStorage.setItem('moviesInQueue', JSON.stringify(filteredMoviesInQueue));
}
function deleteWatchedMoviesDuplicates(movies) {
  filteredWatchedMovies = movies.filter((item, index) => {
    return movies.indexOf(item) === index;
  });
  return filteredWatchedMovies;
}

function deleteMoviesInQueueDuplicates(movies) {
  filteredMoviesInQueue = movies.filter((item, index) => {
    return movies.indexOf(item) === index;
  });
  return filteredMoviesInQueue;
}

// відкриття модалки в бібліотеці

let filmId = '';

refs.openFilmModal.addEventListener('click', onCardClick);

export function openFilmModal() {
  refs.filmModal.classList.remove('is-hidden');
  refs.closeFilmModal.addEventListener('click', closeFilmModal);
  refs.closeFilmModalBtn.addEventListener('click', closeFilmModal);
  window.addEventListener('keydown', closeFilmModal);
}

export function closeFilmModal(e) {
  if (
    e.target === refs.closeFilmModal ||
    e.currentTarget === refs.closeFilmModalBtn
  ) {
    refs.filmModal.classList.add('is-hidden');
    if (refs.queueBtn.classList.contains('current')) {
      clickOnQueueBtn();
    } else {
      clickOnWatchedBtn();
    }
    return;
  } else if (e.key === 'Escape') {
    refs.filmModal.classList.add('is-hidden');
    window.removeEventListener('keydown', closeFilmModal);
  }
  if (refs.queueBtn.classList.contains('current')) {
    clickOnQueueBtn();
  } else {
    clickOnWatchedBtn();
  }
}

export function renderFilmInfo(filmData) {
  const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies'));
  const moviesInQueue = JSON.parse(localStorage.getItem('moviesInQueue'));
  const markup = filmCardTemplate(filmData);

  refs.filmCard.innerHTML = markup;
  const watchedButton = refs.filmCard.querySelector('#watched');
  if (watchedMovies.find(element => element.id === Number(filmId))) {
    watchedButton.textContent = 'REMOVE FROM WATCHED';
  }
  const queuedButton = refs.filmCard.querySelector('#queue');
  if (moviesInQueue.find(element => element.id === Number(filmId))) {
    queuedButton.textContent = 'REMOVE FROM QUEUE';
  }

  return Promise.resolve();
}

export function onCardClick(event) {
  if (event.target.className === 'img') {
    filmId = event.target.getAttribute('id');
    filmId && showFilmInfo(filmId);
    refs.modalFilm.id = filmId;
    openFilmModal();
  }
}
export function showFilmInfo(movieId) {
  getById(movieId).then(renderFilmInfo).then(openFilmModal).catch(console.log);
}
