const refs = {
  openTeamModal: document.querySelector('[data-team-modal-open]'),
  closeTeamModal: document.querySelector('[data-team-modal-close]'),
  teamModal: document.querySelector('[data-team-modal]'),
  closeTeamModalBtn: document.querySelector('.btn-team-modal-close__svg'),
};

refs.openTeamModal.addEventListener('click', openTeamModal);

export function openTeamModal() {
  refs.teamModal.classList.remove('is-hidden');
  refs.closeTeamModal.addEventListener('click', closeTeamModal);
  refs.closeTeamModalBtn.addEventListener('click', closeTeamModal);
  window.addEventListener('keydown', closeTeamModal);
}

export function closeTeamModal(e) {
  if (
    e.target === refs.closeTeamModal ||
    e.currentTarget === refs.closeTeamModalBtn
  ) {
    refs.teamModal.classList.add('is-hidden');
    return;
  } else if (e.key === 'Escape') {
    refs.teamModal.classList.add('is-hidden');
    window.removeEventListener('keydown', closeTeamModal);
  }
}
