// Lazy load images using IntersectionObserver
(function(){
  if(!('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '200px',
    threshold: 0.01
  };

  let io = null;

  const onIntersection = (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');
        if (src) { img.src = src; }
        if (srcset) { img.srcset = srcset; }
        img.classList.remove('lazyload');
        img.classList.add('lazyloaded');
        obs.unobserve(img);
      }
    });
  };

  const createObserver = () => new IntersectionObserver(onIntersection, observerOptions);

  const observeImages = () => {
    const images = document.querySelectorAll('img.lazyload');
    if (!images.length) return;
    if (!io) {
      io = createObserver();
    }
    images.forEach(img => io.observe(img));
  };

  window.lazyLoadImages = observeImages;
  document.addEventListener('DOMContentLoaded', observeImages);
})();
