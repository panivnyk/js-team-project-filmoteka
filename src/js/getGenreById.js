export function getGenreById(genreId, genresArray) {
  const genres = genresArray.find(option => option.id === genreId);
  return genres.name;
}
