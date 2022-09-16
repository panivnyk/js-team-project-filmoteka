import { openFilmModal, showFilmInfo, closeFilmModal } from './js/film-modal';
export const API_KEY = '520faa847257d57af54017c37ef43fe0';
import axios from 'axios';
import { getTrending } from './js/getTrending.js';
// import { createMarkup } from './js/markupListMovies.js';
import pagination from './js/pagination';
import { onSearch } from './js/getBySearch.js';
import { openTeamModal, closeTeamModal } from './js/team-modal';
import './js/scroll-button';
import { getById } from './js/getById';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('.input'),
  summitButton: document.querySelector('.submit-btn'),
  linkToTeam: document.querySelector('.footer__link'),
  moviesList: document.querySelector('.film__list'),
};

export { refs };

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
