import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

const refs = {
  moviesList: document.querySelector('.film__list'),
};

export function addEfectRenderer() {
  for (let i = 0; i < refs.moviesList.children.length; i++) {
    const indexChild = refs.moviesList.children[i];
    if (window.innerWidth > 768) {
      indexChild.setAttribute('data-aos', 'zoom-in');
    } else if (i % 2 == 0) {
      indexChild.setAttribute('data-aos', 'fade-right');
    } else {
      indexChild.setAttribute('data-aos', 'fade-left');
    }
  }
}
