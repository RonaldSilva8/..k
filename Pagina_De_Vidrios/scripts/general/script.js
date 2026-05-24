function updateBodyPadding() {
  const header = document.querySelector('header');
  if (!header) return;
  document.body.style.paddingTop = header.offsetHeight + 'px';
}

window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;

  // initial sync
  updateBodyPadding();

  window.addEventListener('scroll', function() {
    if (window.scrollY > 70) {
      header.classList.add('small');
    } else {
      header.classList.remove('small');
    }
    // update padding after header changes size
    updateBodyPadding();
  });

  window.addEventListener('resize', updateBodyPadding);
});