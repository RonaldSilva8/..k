const modalState = {
    images: [],
    currentIndex: 0,
};

function nextSlide(section) {
    const carousel = document.getElementById("carousel-" + section);
    const items = carousel.querySelectorAll(".carousel-item");
    const firstItem = items[0];
    carousel.appendChild(carousel.removeChild(firstItem));
}

function prevSlide(section) {
    const carousel = document.getElementById("carousel-" + section);
    const items = carousel.querySelectorAll(".carousel-item");
    const lastItem = items[items.length - 1];
    carousel.insertBefore(lastItem, carousel.firstChild);
}

function bindCarouselButtons() {
    const buttons = document.querySelectorAll('[data-action][data-carousel]');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            const section = button.dataset.carousel;

            if (!section || !action) {
                return;
            }

            if (action === 'next') {
                nextSlide(section);
            } else if (action === 'prev') {
                prevSlide(section);
            }
        });
    });
}

function updateModalImage(index) {
    const modalImage = document.getElementById('enlarged-image');
    const caption = document.getElementById('modal-caption');

    if (!modalImage || !caption || !modalState.images.length) {
        return;
    }

    const image = modalState.images[index];
    modalImage.src = image.src;
    modalImage.alt = image.alt || 'Imagen ampliada';
    caption.textContent = image.alt || `Imagen ${index + 1}`;
    modalState.currentIndex = index;
}

function openImageModal(images, index) {
    const overlay = document.getElementById('image-modal');

    if (!overlay || !images || !images.length) {
        return;
    }

    modalState.images = images;
    modalState.currentIndex = index;
    updateModalImage(index);
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
}

function closeImageModal() {
    const overlay = document.getElementById('image-modal');
    const modalImage = document.getElementById('enlarged-image');
    const caption = document.getElementById('modal-caption');

    if (!overlay || !modalImage || !caption) {
        return;
    }

    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
    caption.textContent = '';
    modalState.images = [];
    modalState.currentIndex = 0;
}

function prevModalImage() {
    if (!modalState.images.length) {
        return;
    }

    const prevIndex = (modalState.currentIndex - 1 + modalState.images.length) % modalState.images.length;
    updateModalImage(prevIndex);
}

function nextModalImage() {
    if (!modalState.images.length) {
        return;
    }

    const nextIndex = (modalState.currentIndex + 1) % modalState.images.length;
    updateModalImage(nextIndex);
}

function bindEnlargeableImages() {
    const images = document.querySelectorAll('.carousel-item img');
    const overlay = document.getElementById('image-modal');

    if (!overlay) {
        return;
    }

    images.forEach((image) => {
        image.style.cursor = 'zoom-in';
        image.addEventListener('click', () => {
            const carousel = image.closest('.carousel');
            const carouselImages = Array.from(carousel.querySelectorAll('img'));
            const index = carouselImages.indexOf(image);
            openImageModal(carouselImages, index);
        });
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeImageModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeImageModal();
        }

        if (event.key === 'ArrowLeft') {
            prevModalImage();
        }

        if (event.key === 'ArrowRight') {
            nextModalImage();
        }
    });
}

function bindModalControls() {
    const prevButton = document.getElementById('modal-prev');
    const nextButton = document.getElementById('modal-next');

    if (prevButton) {
        prevButton.addEventListener('click', (event) => {
            event.stopPropagation();
            prevModalImage();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (event) => {
            event.stopPropagation();
            nextModalImage();
        });
    }
}

function bindSwipeGestures() {
    const containers = document.querySelectorAll('.carousel-wrapper');

    containers.forEach((container) => {
        let startX = null;

        container.addEventListener('pointerdown', (event) => {
            startX = event.clientX;
        });

        container.addEventListener('pointerup', (event) => {
            if (startX === null) {
                return;
            }

            const deltaX = event.clientX - startX;
            if (Math.abs(deltaX) < 40) {
                startX = null;
                return;
            }

            const carousel = container.querySelector('.carousel');
            const section = carousel.id.replace('carousel-', '');

            if (deltaX < 0) {
                nextSlide(section);
            } else {
                prevSlide(section);
            }

            startX = null;
        });
    });

    const modalOverlay = document.getElementById('image-modal');
    if (!modalOverlay) {
        return;
    }

    let modalStartX = null;
    modalOverlay.addEventListener('pointerdown', (event) => {
        modalStartX = event.clientX;
    });

    modalOverlay.addEventListener('pointerup', (event) => {
        if (modalStartX === null) {
            return;
        }

        const deltaX = event.clientX - modalStartX;
        if (Math.abs(deltaX) > 40) {
            if (deltaX < 0) {
                nextModalImage();
            } else {
                prevModalImage();
            }
        }

        modalStartX = null;
    });
}

function init() {
    bindCarouselButtons();
    bindEnlargeableImages();
    bindModalControls();
    bindSwipeGestures();
}

document.addEventListener('DOMContentLoaded', init);
