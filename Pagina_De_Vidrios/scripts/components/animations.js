/**
 * ScrollAnimations
 * Detecta elementos cuando entran en viewport y aplica animaciones
 */

class ScrollAnimations {
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px 0px -50px 0px',
            animationDelay: options.animationDelay || 100
        };

        this.observer = null;
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.observeElements();
    }

    observeElements() {
        // Elementos que se animan con scroll
        const selectors = [
            '[data-animate]',
            'section',
            '.card',
            '.gallery-card',
            '.stat-card',
            '.testimonial-card',
            '.faq-item',
            '.detail-item'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.observer.observe(element);
            });
        });
    }

    animateElement(element) {
        const animation = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-animate-delay') || this.options.animationDelay;

        if (animation) {
            setTimeout(() => {
                element.classList.add(`animate-${animation}`);
            }, parseInt(delay));
        } else {
            // Default animation
            setTimeout(() => {
                element.classList.add('animate-fade-in-up');
            }, parseInt(delay));
        }
    }

    /**
     * Anima elementos manualmente
     */
    animateNow(selector, animation = 'fade-in-up', delay = 0) {
        document.querySelectorAll(selector).forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(`animate-${animation}`);
            }, delay + (index * this.options.animationDelay));
        });
    }

    /**
     * Para de observar un elemento
     */
    stopObserving(element) {
        if (this.observer) {
            this.observer.unobserve(element);
        }
    }

    /**
     * Reinicia las observaciones
     */
    refresh() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.init();
    }
}

/**
 * Parallax Effect
 * Crea efecto parallax simple en elementos con data-parallax
 */
class ParallaxEffect {
    constructor(speed = 0.5) {
        this.speed = speed;
        this.elements = [];
        this.init();
    }

    init() {
        this.elements = document.querySelectorAll('[data-parallax]');
        window.addEventListener('scroll', () => this.update());
    }

    update() {
        const scrollY = window.scrollY;

        this.elements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || this.speed;
            const yPos = scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

/**
 * Ripple Button Effect
 * Crea efecto de ondas en botones al hacer click
 */
class RippleEffect {
    constructor(buttonSelector = 'button, .btn') {
        this.buttons = document.querySelectorAll(buttonSelector);
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e));
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
}

/**
 * Counter Animation
 * Anima contadores de números
 */
class CounterAnimation {
    constructor(selector = '.counter', duration = 2000) {
        this.selector = selector;
        this.duration = duration;
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            threshold: 0.5
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll(this.selector).forEach(element => {
            this.observer.observe(element);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent);
        const increment = target / (this.duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

/**
 * Text Reveal Animation
 * Revela texto palabra por palabra
 */
class TextRevealAnimation {
    constructor(selector = '[data-text-reveal]') {
        this.selector = selector;
        this.init();
    }

    init() {
        document.querySelectorAll(this.selector).forEach(element => {
            this.setupTextReveal(element);
        });
    }

    setupTextReveal(element) {
        const text = element.textContent;
        const words = text.split(' ');

        element.innerHTML = words
            .map((word, index) => 
                `<span style="animation-delay: ${index * 0.05}s;" class="text-reveal">${word}</span>`
            )
            .join(' ');
    }
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Scroll animations
    const scrollAnimations = new ScrollAnimations();

    // Parallax
    if (document.querySelector('[data-parallax]')) {
        new ParallaxEffect();
    }

    // Ripple effect
    new RippleEffect();

    // Counters
    if (document.querySelector('.counter')) {
        new CounterAnimation();
    }

    // Text reveal
    new TextRevealAnimation();
});

// Exportar para uso global
window.ScrollAnimations = ScrollAnimations;
window.ParallaxEffect = ParallaxEffect;
window.RippleEffect = RippleEffect;
window.CounterAnimation = CounterAnimation;
window.TextRevealAnimation = TextRevealAnimation;
