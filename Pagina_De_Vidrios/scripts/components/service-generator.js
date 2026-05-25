/**
 * ServiceComponentGenerator
 * Genera componentes de servicios automáticamente desde JSON
 * Reduce repetición de HTML y facilita mantenimiento
 */

class ServiceComponentGenerator {
    constructor(jsonPath = 'data/services.json') {
        this.jsonPath = jsonPath;
        this.services = [];
    }

    /**
     * Carga los datos de servicios desde JSON
     */
    async loadServices() {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            this.services = data.services;
            return this.services;
        } catch (error) {
            console.error('Error cargando servicios:', error);
            return [];
        }
    }

    /**
     * Genera HTML para una imagen del carrusel
     */
    generateImageHTML(image, isFirst = false) {
        if (image.type === 'placeholder') {
            return `
                <div class="carousel-item" role="listitem" tabindex="0">
                    <div class="image-placeholder" style="background: ${image.gradient};"></div>
                    <p class="image-caption">${image.caption}</p>
                </div>
            `;
        }

        const loading = isFirst ? 'eager' : 'lazy';
        const fetchpriority = isFirst ? 'high' : 'low';
        
        if (loading === 'eager') {
            return `
                <div class="carousel-item" role="listitem" tabindex="0">
                    <img src="${image.src}" srcset="${image.src} 800w, ${image.src} 400w" 
                         sizes="(max-width:600px) 100vw, 800px" alt="${image.alt}" 
                         loading="${loading}" decoding="async" fetchpriority="${fetchpriority}">
                    <p class="image-caption">${image.caption}</p>
                </div>
            `;
        } else {
            return `
                <div class="carousel-item" role="listitem" tabindex="0">
                    <img class="lazyload" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'></svg>" 
                         data-src="${image.src}" data-srcset="${image.src} 800w, ${image.src} 400w" 
                         sizes="(max-width:600px) 100vw, 800px" alt="${image.alt}" 
                         loading="${loading}" decoding="async" fetchpriority="${fetchpriority}">
                    <p class="image-caption">${image.caption}</p>
                </div>
            `;
        }
    }

    /**
     * Genera HTML para el carrusel completo
     */
    generateCarouselHTML(service) {
        const images = service.images.map((img, idx) => this.generateImageHTML(img, idx === 0)).join('');
        
        return `
            <div class="carousel-container">
                <button class="carousel-btn prev" data-action="prev" data-carousel="${service.id}" aria-label="Foto anterior">❮</button>
                
                <div class="carousel-wrapper">
                    <div class="carousel" id="carousel-${service.id}" role="list" aria-roledescription="carrusel" aria-label="Galería ${service.title}">
                        ${images}
                    </div>
                </div>
                
                <button class="carousel-btn next" data-action="next" data-carousel="${service.id}" aria-label="Siguiente foto">❯</button>
            </div>
        `;
    }

    /**
     * Genera HTML para los detalles de servicios
     */
    generateDetailsHTML(details) {
        const detailsHTML = details.map(detail => `
            <div class="detail-item">
                <h3>${detail.title}</h3>
                <ul>
                    ${detail.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        return `
            <div class="service-details">
                ${detailsHTML}
            </div>
        `;
    }

    /**
     * Genera artículo completo del servicio
     */
    generateServiceArticle(service) {
        return `
            <article id="${service.id}">
                <section>
                    <h2>${service.title}</h2>
                    <p>${service.description}</p>
                    
                    ${this.generateCarouselHTML(service)}
                    ${this.generateDetailsHTML(service.details)}
                    
                    <a href="contactos/index.html" class="btn">Solicitar Cotización</a>
                </section>
            </article>
        `;
    }

    /**
     * Renderiza todos los servicios en un contenedor
     */
    async renderServices(containerId) {
        try {
            if (this.services.length === 0) {
                await this.loadServices();
            }

            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Contenedor con id "${containerId}" no encontrado`);
                return;
            }

            const html = this.services.map(service => this.generateServiceArticle(service)).join('');
            container.innerHTML = html;

            // Reinicializar carruseles y lazy loading después de renderizar
            if (window.initCarousels) {
                window.initCarousels();
            }
            if (window.lazyLoadImages) {
                window.lazyLoadImages();
            }

            return true;
        } catch (error) {
            console.error('Error renderizando servicios:', error);
            return false;
        }
    }

    /**
     * Agrega un nuevo servicio dinámicamente
     */
    async addService(service, containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Contenedor con id "${containerId}" no encontrado`);
                return false;
            }

            const serviceHTML = this.generateServiceArticle(service);
            container.insertAdjacentHTML('beforeend', serviceHTML);

            // Reinicializar carruseles y lazy loading
            if (window.initCarousels) {
                window.initCarousels();
            }
            if (window.lazyLoadImages) {
                window.lazyLoadImages();
            }

            return true;
        } catch (error) {
            console.error('Error agregando servicio:', error);
            return false;
        }
    }

    /**
     * Actualiza un servicio existente
     */
    async updateService(serviceId, updatedData, containerId) {
        try {
            const serviceIndex = this.services.findIndex(s => s.id === serviceId);
            if (serviceIndex === -1) {
                console.error(`Servicio con id "${serviceId}" no encontrado`);
                return false;
            }

            this.services[serviceIndex] = { ...this.services[serviceIndex], ...updatedData };
            
            const container = document.getElementById(containerId);
            const article = container.querySelector(`article#${serviceId}`);
            
            if (article) {
                const updatedHTML = this.generateServiceArticle(this.services[serviceIndex]);
                article.outerHTML = updatedHTML;

                if (window.initCarousels) {
                    window.initCarousels();
                }
                if (window.lazyLoadImages) {
                    window.lazyLoadImages();
                }
            }

            return true;
        } catch (error) {
            console.error('Error actualizando servicio:', error);
            return false;
        }
    }

    /**
     * Obtiene un servicio específico
     */
    getService(serviceId) {
        return this.services.find(s => s.id === serviceId);
    }

    /**
     * Obtiene todos los servicios
     */
    getAllServices() {
        return [...this.services];
    }

    /**
     * Filtra servicios por criterio
     */
    filterServices(criterion) {
        return this.services.filter(criterion);
    }
}

/**
 * Inicialización automática si está disponible el elemento de contenedor
 */
document.addEventListener('DOMContentLoaded', async () => {
    const servicesContainer = document.getElementById('services-container');
    
    if (servicesContainer) {
        const generator = new ServiceComponentGenerator();
        await generator.renderServices('services-container');
    }
});

// Exportar para uso global
window.ServiceComponentGenerator = ServiceComponentGenerator;
