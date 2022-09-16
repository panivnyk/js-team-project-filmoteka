const srcImgBase = 'https://image.tmdb.org/t/p/w500';
const refs = {
  moviesList: document.querySelector('.film__list'),
};

function movieTemplate(data) {
  let filmGenre = [];
  for (let object of data.genres) {
    filmGenre.push(object.name);
  }
  let poster = '';
  data.poster_path === null
    ? (poster = '/uc4RAVW1T3T29h6OQdr7zu4Blui.jpg')
    : (poster = data.poster_path);
  let relDate = '';
  if (
    data.release_date === '' ||
    data.release_date === null ||
    data.release_date === undefined
  ) {
    relDate = 'No date';
  } else {
    relDate = data.release_date.slice(0, 4);
  }

  let renderGanres = '';
  if (filmGenre.length === 0) {
    renderGanres = 'No genres';
  } else if (filmGenre.length < 3) {
    renderGanres = filmGenre.join(',&nbsp;');
  } else {
    renderGanres = `${filmGenre[0]}, ${filmGenre[1]}, Others`;
  }

  return `<li class="gallery__item" data-itemid="${data.id}">
            <img src="${srcImgBase}${poster}" alt="${data.original_title}" class="img" id="${data.id}"/>
            <div class="item__ptext">
              <h2 class="item__capt">${data.title}</h2>
              <div class="item__wrap">
                <p class="item__genre">${renderGanres} | ${relDate}</p>
                <p class="item__rating">${data.vote_average}</p>
              </div>
            </div>
          </li>`;
}

export function renderCollection(data) {
  const markup = movieTemplate(data);
  refs.moviesList.insertAdjacentHTML('beforeend', markup);
}
