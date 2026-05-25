/**
 * GalleryManager
 * Sistema completo de galerías con filtros, búsqueda y lightbox
 */

class GalleryManager {
    constructor(gallerySelector, options = {}) {
        this.galleryContainer = document.querySelector(gallerySelector);
        if (!this.galleryContainer) {
            console.error(`Galería no encontrada: ${gallerySelector}`);
            return;
        }

        this.options = {
            columns: options.columns || 3,
            showFilters: options.showFilters !== false,
            showSearch: options.showSearch !== false,
            lightbox: options.lightbox !== false,
            items: options.items || [],
            ...options
        };

        this.allItems = [];
        this.filteredItems = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    /**
     * Inicializa la galería
     */
    init() {
        this.loadItems();
        this.setupFilters();
        this.setupSearch();
        this.setupLightbox();
        this.render();
    }

    /**
     * Carga los items de la galería
     */
    loadItems() {
        const items = this.galleryContainer.querySelectorAll('[data-gallery-item]');
        this.allItems = Array.from(items).map((item, index) => ({
            id: item.getAttribute('data-gallery-id') || `item-${index}`,
            title: item.getAttribute('data-gallery-title') || '',
            description: item.getAttribute('data-gallery-description') || '',
            category: item.getAttribute('data-gallery-category') || 'all',
            image: item.getAttribute('data-gallery-image') || '',
            element: item
        }));

        this.filteredItems = [...this.allItems];
    }

    /**
     * Configura los filtros
     */
    setupFilters() {
        if (!this.options.showFilters) return;

        const categories = ['all', ...new Set(this.allItems.map(item => item.category))];
        const filterContainer = document.createElement('div');
        filterContainer.className = 'gallery-filters';

        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            if (category === 'all') btn.classList.add('active');
            btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            btn.addEventListener('click', () => this.filterByCategory(category, btn));
            filterContainer.appendChild(btn);
        });

        this.galleryContainer.insertBefore(filterContainer, this.galleryContainer.firstChild);
        this.filterContainer = filterContainer;
    }

    /**
     * Filtra por categoría
     */
    filterByCategory(category, button) {
        this.currentFilter = category;
        this.searchTerm = '';

        // Actualizar botón activo
        this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Filtrar items
        if (category === 'all') {
            this.filteredItems = [...this.allItems];
        } else {
            this.filteredItems = this.allItems.filter(item => item.category === category);
        }

        this.render();
    }

    /**
     * Configura la búsqueda
     */
    setupSearch() {
        if (!this.options.showSearch) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'gallery-search';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Buscar en galería...';
        input.addEventListener('input', (e) => this.search(e.target.value));

        searchContainer.appendChild(input);
        this.galleryContainer.insertBefore(searchContainer, this.galleryContainer.firstChild);
    }

    /**
     * Busca items
     */
    search(term) {
        this.searchTerm = term.toLowerCase();
        
        if (this.searchTerm === '') {
            this.filteredItems = this.currentFilter === 'all'
                ? [...this.allItems]
                : this.allItems.filter(item => item.category === this.currentFilter);
        } else {
            const filtered = this.allItems.filter(item => 
                item.title.toLowerCase().includes(this.searchTerm) ||
                item.description.toLowerCase().includes(this.searchTerm)
            );

            if (this.currentFilter !== 'all') {
                this.filteredItems = filtered.filter(item => item.category === this.currentFilter);
            } else {
                this.filteredItems = filtered;
            }
        }

        this.render();
    }

    /**
     * Configura lightbox
     */
    setupLightbox() {
        if (!this.options.lightbox) return;

        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="gallery-lightbox-content">
                <button class="gallery-lightbox-close">&times;</button>
                <button class="gallery-lightbox-nav gallery-lightbox-prev">❮</button>
                <img class="gallery-lightbox-image" alt="">
                <div class="gallery-lightbox-info">
                    <h3 class="gallery-lightbox-title"></h3>
                    <p class="gallery-lightbox-description"></p>
                </div>
                <button class="gallery-lightbox-nav gallery-lightbox-next">❯</button>
                <span class="gallery-lightbox-counter"></span>
            </div>
        `;

        document.body.appendChild(lightbox);
        this.lightbox = lightbox;

        lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });

        lightbox.querySelector('.gallery-lightbox-prev').addEventListener('click', () => {
            this.previousImage();
        });

        lightbox.querySelector('.gallery-lightbox-next').addEventListener('click', () => {
            this.nextImage();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.previousImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });
    }

    /**
     * Abre lightbox
     */
    openLightbox(itemId) {
        const item = this.filteredItems.find(i => i.id === itemId);
        if (!item) return;

        this.currentLightboxIndex = this.filteredItems.indexOf(item);
        this.updateLightbox();
        this.lightbox.classList.add('active');
    }

    /**
     * Cierra lightbox
     */
    closeLightbox() {
        this.lightbox.classList.remove('active');
    }

    /**
     * Actualiza lightbox
     */
    updateLightbox() {
        const item = this.filteredItems[this.currentLightboxIndex];
        this.lightbox.querySelector('.gallery-lightbox-image').src = item.image;
        this.lightbox.querySelector('.gallery-lightbox-image').alt = item.title;
        this.lightbox.querySelector('.gallery-lightbox-title').textContent = item.title;
        this.lightbox.querySelector('.gallery-lightbox-description').textContent = item.description;
        this.lightbox.querySelector('.gallery-lightbox-counter').textContent =
            `${this.currentLightboxIndex + 1} / ${this.filteredItems.length}`;
    }

    /**
     * Imagen anterior
     */
    previousImage() {
        this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
        this.updateLightbox();
    }

    /**
     * Siguiente imagen
     */
    nextImage() {
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.filteredItems.length;
        this.updateLightbox();
    }

    /**
     * Renderiza la galería
     */
    render() {
        const mainContent = this.galleryContainer.querySelector('.gallery-masonry') || this.createMasonryContainer();

        if (this.filteredItems.length === 0) {
            mainContent.innerHTML = `
                <div class="gallery-empty" style="grid-column: 1 / -1;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No se encontraron imágenes</p>
                </div>
            `;
        } else {
            mainContent.innerHTML = this.filteredItems.map(item => `
                <div class="gallery-item" data-gallery-item-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-icon">👁</div>
                    </div>
                    ${item.category !== 'all' ? `<span class="gallery-badge">${item.category}</span>` : ''}
                </div>
            `).join('');

            mainContent.querySelectorAll('.gallery-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.openLightbox(item.getAttribute('data-gallery-item-id'));
                });
            });
        }

        // Estadísticas
        const statsDiv = mainContent.querySelector('.gallery-stats');
        if (!statsDiv) {
            const stats = document.createElement('div');
            stats.className = 'gallery-stats';
            mainContent.appendChild(stats);
        }

        const newStats = mainContent.querySelector('.gallery-stats');
        newStats.textContent = `Mostrando ${this.filteredItems.length} de ${this.allItems.length} imágenes`;
    }

    /**
     * Crea contenedor masonry
     */
    createMasonryContainer() {
        const container = document.createElement('div');
        container.className = 'gallery-masonry';
        this.galleryContainer.appendChild(container);
        return container;
    }

    /**
     * Agrega un item a la galería
     */
    addItem(item) {
        this.allItems.push(item);
        this.filteredItems = [...this.allItems];
        this.render();
    }

    /**
     * Remueve un item
     */
    removeItem(itemId) {
        this.allItems = this.allItems.filter(item => item.id !== itemId);
        this.filteredItems = this.filteredItems.filter(item => item.id !== itemId);
        this.render();
    }

    /**
     * Obtiene items actuales filtrados
     */
    getFilteredItems() {
        return [...this.filteredItems];
    }
}

// Exportar para uso global
window.GalleryManager = GalleryManager;

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
        new GalleryManager(`#${gallery.id}`);
    });
});
