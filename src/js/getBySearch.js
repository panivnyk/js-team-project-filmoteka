import { API_KEY } from './key.js';
import Notiflix from 'notiflix';
import Loading from './loading';
import { loadingOn, loadingOff } from './loading';
import { getGenreById } from './getGenreById.js';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('.input'),
  summitButton: document.querySelector('.submit-btn'),
  linkToTeam: document.querySelector('.footer__link'),
  moviesList: document.querySelector('.film__list'),
  searchErrorNotif: document.querySelector('#searchErrorNotif'),
};

let currentPage = 1;

let markup = '';

let totalPages = 1;

export async function fetchMovies(inputQuery, currentPage) {
  const mainUrl = `https://api.themoviedb.org/3/search/movie`;
  const filters = `?api_key=${API_KEY}&query=${inputQuery}&page=${currentPage}`;
  const response = await fetch(`${mainUrl}${filters}`);
  return response.json();
}

let inputQuery = '';
refs.searchForm.addEventListener('submit', onSearch);

export async function onSearch(event) {
  event.preventDefault();

  inputQuery = refs.searchInput.value;
  addPagination();
}

export default async function renderMoviesList(pageNumber) {
  currentPage = pageNumber;

  await fetchMovies(inputQuery, currentPage).then(res => {
    const moviesResult = res.results;
    if (moviesResult.length >= 1) {
      markup = moviesResult.map(
        ({
          id,
          title,
          original_title,
          poster_path,
          genre_ids,
          release_date,
          vote_average,
        }) => {
          const genresList = JSON.parse(localStorage.getItem('genres'));
          const genres = genre_ids.map(item => {
            return getGenreById(item, genresList);
          });
          // check for genres available and formatting their
          let genresMarkup = '';
          if (genres.length === 0) {
            genresMarkup = 'No genres';
          } else if (genres.length < 3) {
            genresMarkup = genres.join(',&nbsp;');
          } else {
            genresMarkup = `${genres[0]}, ${genres[1]}, Others`;
          }
          // check for poster available
          let poster = '';
          poster_path === null
            ? (poster = '/uc4RAVW1T3T29h6OQdr7zu4Blui.jpg')
            : (poster = poster_path);
          // check for the presence of a date
          let relDate = '';
          release_date === '' || release_date === undefined
            ? (relDate = 'No date')
            : (relDate = release_date.slice(0, 4));

          return `<li class="gallery__item" >
            <img src="https://image.tmdb.org/t/p/w500${poster}" alt="${original_title}" class="img"  id="${id}"/>
            <div class="item__ptext">
              <h2 class="item__capt">${title}</h2>
              <div class="item__wrap">
                <p class="item__genre">${genresMarkup} | ${relDate}</p>
              </div>
            </div>
        </li>`;
        }
      );
      return markup;
    }
  });
}

async function addPagination() {
  await fetchMovies(inputQuery, currentPage).then(res => {
    totalPages = res.total_pages;
    return totalPages;
  });
  if (totalPages === 0) {
    refs.searchErrorNotif.textContent =
      'Search result not successful. Enter the correct movie name and try again';
    $(`#pagination-container`).pagination(`destroy`);
    refs.moviesList.innerHTML = ``;
    return;
  } else if (inputQuery === ``) {
    refs.searchErrorNotif.textContent = 'Please enter the name of the movie';
    $(`#pagination-container`).pagination(`destroy`);
    refs.moviesList.innerHTML = ``;
    return;
  }
  refs.searchErrorNotif.textContent = '';
  loadingOn();
  $(`#pagination-container`).pagination({
    dataSource: function (done) {
      var result = [];
      for (var i = 1; i <= totalPages; i++) {
        result.push(i);
      }
      done(result);
    },
    pageSize: 1,
    callback: async function (data, pagination) {
      await renderMoviesList(pagination.pageNumber);
      var html = markup;
      $(`.film__list`).html(html);
      loadingOff();
    },
  });

  $(`#pagination-container`).addHook('beforePaging', function () {
    loadingOn();
  });

  loadingOff();
}
