import axios from 'axios';
import { API_KEY } from './key.js';

export async function getGenres() {
  try {
    const resGenres = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    return await resGenres.data;
  } catch (error) {
    console.log(error);
  }
}
