const questions = document.querySelectorAll('.faq-question');

questions.forEach((button) => {
  button.addEventListener('click', () => toggleAnswer(button));
});

function toggleAnswer(button) {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  const answerId = button.getAttribute('aria-controls');
  const answer = document.getElementById(answerId);
  const icon = button.querySelector('.faq-icon');

  if (isExpanded) {
    // Currently open -> close it
    button.setAttribute('aria-expanded', 'false');
    answer.hidden = true;
    icon.src = 'assets/images/icon-plus.svg';
  } else {
    // Currently closed -> open it
    button.setAttribute('aria-expanded', 'true');
    answer.hidden = false;
    icon.src = 'assets/images/icon-minus.svg';
  }
}
