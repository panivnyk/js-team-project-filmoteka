const scrollBtn = document.querySelector('.scroll-up__btn');

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 1200 ||
    document.documentElement.scrollTop > 1200
  ) {
    scrollBtn.classList.remove('is-hidden');
  } else {
    scrollBtn.classList.add('is-hidden');
  }
}

scrollBtn.addEventListener('click', backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
