export function checkLocalStorageOnwatch() {
  if (
    localStorage.getItem('watchedMovies') === null ||
    JSON.parse(localStorage.getItem('watchedMovies')).length === 0
  ) {
    return true;
  }

  return false;
}
export function checkLocalStorageOnQueue() {
  if (
    localStorage.getItem('moviesInQueue') === null ||
    JSON.parse(localStorage.getItem('moviesInQueue')).length === 0
  ) {
    return true;
  }

  return false;
}
