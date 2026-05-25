/**
 * ResponsiveImageHelper
 * Genera elementos <picture> con soporte AVIF, WebP y JPG
 * Simplifica la implementación de imágenes responsivas
 */

class ResponsiveImageHelper {
    /**
     * Genera un elemento <picture> completo con múltiples formatos
     * @param {Object} config - Configuración de la imagen
     * @param {string} config.basePath - Ruta sin extensión (ej: 'Imagenes/Ventaneria/Ventaneria1')
     * @param {string} config.alt - Texto alternativo
     * @param {string} config.caption - Caption opcional
     * @param {string} config.loading - 'eager' o 'lazy'
     * @param {boolean} config.hasAvif - Incluir AVIF (default: true)
     * @returns {string} HTML del elemento picture
     */
    static generatePicture(config) {
        const {
            basePath,
            alt,
            caption = '',
            loading = 'lazy',
            hasAvif = true,
            fetchpriority = 'low'
        } = config;

        let html = '<picture>';

        if (hasAvif) {
            // AVIF - Móvil
            html += `
                <source media="(max-width: 600px)"
                        srcset="${basePath}-400w.avif 400w"
                        type="image/avif">
                <!-- AVIF - Tablet/Desktop -->
                <source media="(min-width: 601px)"
                        srcset="${basePath}-800w.avif 800w, ${basePath}-1200w.avif 1200w"
                        type="image/avif">
            `;
        }

        // WebP - Móvil
        html += `
            <source media="(max-width: 600px)"
                    srcset="${basePath}-400w.webp 400w"
                    type="image/webp">
            <!-- WebP - Tablet/Desktop -->
            <source media="(min-width: 601px)"
                    srcset="${basePath}-800w.webp 800w, ${basePath}-1200w.webp 1200w"
                    type="image/webp">
        `;

        // JPG fallback
        html += `
            <img src="${basePath}-800w.jpg"
                 srcset="${basePath}-400w.jpg 400w, ${basePath}-800w.jpg 800w"
                 sizes="(max-width: 600px) 100vw, 800px"
                 alt="${alt}"
                 loading="${loading}"
                 decoding="async"
                 fetchpriority="${fetchpriority}">
        `;

        html += '</picture>';

        if (caption) {
            html += `<p class="image-caption">${caption}</p>`;
        }

        return html;
    }

    /**
     * Genera múltiples imágenes para un carrusel
     * @param {Array} images - Array de objetos con basePath, alt, caption
     * @returns {string} HTML de carrusel con picture elements
     */
    static generateCarousel(images) {
        return images
            .map((img, idx) => {
                const loading = idx === 0 ? 'eager' : 'lazy';
                const fetchpriority = idx === 0 ? 'high' : 'low';

                return `
                    <div class="carousel-item" role="listitem" tabindex="0">
                        ${this.generatePicture({
                            basePath: img.basePath,
                            alt: img.alt,
                            caption: img.caption || '',
                            loading,
                            fetchpriority
                        })}
                    </div>
                `;
            })
            .join('');
    }

    /**
     * Convierte un objeto de imagen antigua al nuevo formato
     * Útil para migración gradual
     * @param {string} imagePath - Ruta antigua de imagen (ej: 'Imagenes/Ventaneria/Ventaneria1.webp')
     * @returns {string} basePath sin extensión
     */
    static extractBasePath(imagePath) {
        return imagePath.replace(/\.(webp|jpg|jpeg|png|avif)$/i, '');
    }

    /**
     * Verifica si existen versiones optimizadas de una imagen
     * @param {string} basePath - Ruta sin extensión
     * @returns {Promise<Object>} Objeto con disponibilidad de cada formato
     */
    static async checkFormats(basePath) {
        const formats = {
            avif_400w: false,
            avif_800w: false,
            avif_1200w: false,
            webp_400w: false,
            webp_800w: false,
            webp_1200w: false,
            jpg_400w: false,
            jpg_800w: false
        };

        for (const format in formats) {
            const ext = format.split('_')[0];
            const size = format.split('_')[1];
            const path = `${basePath}-${size}.${ext}`;

            try {
                const response = await fetch(path, { method: 'HEAD' });
                formats[format] = response.ok;
            } catch (e) {
                formats[format] = false;
            }
        }

        return formats;
    }

    /**
     * Genera un informe de disponibilidad de imágenes
     * @param {Array<string>} imagePaths - Array de rutas de imágenes
     * @returns {Promise<Object>} Informe de disponibilidad
     */
    static async generateImageReport(imagePaths) {
        const report = {};

        for (const path of imagePaths) {
            const basePath = this.extractBasePath(path);
            report[basePath] = await this.checkFormats(basePath);
        }

        return report;
    }

    /**
     * Template helper para plantillas HTML
     * Retorna template literal string para usar en renderización
     */
    static getPictureTemplate(basePath, alt, loading = 'lazy') {
        return `
            <picture>
                <source media="(max-width: 600px)"
                        srcset="${basePath}-400w.avif 400w"
                        type="image/avif">
                <source media="(min-width: 601px)"
                        srcset="${basePath}-800w.avif 800w, ${basePath}-1200w.avif 1200w"
                        type="image/avif">
                <source media="(max-width: 600px)"
                        srcset="${basePath}-400w.webp 400w"
                        type="image/webp">
                <source media="(min-width: 601px)"
                        srcset="${basePath}-800w.webp 800w, ${basePath}-1200w.webp 1200w"
                        type="image/webp">
                <img src="${basePath}-800w.jpg"
                     srcset="${basePath}-400w.jpg 400w, ${basePath}-800w.jpg 800w"
                     sizes="(max-width: 600px) 100vw, 800px"
                     alt="${alt}"
                     loading="${loading}"
                     decoding="async">
            </picture>
        `;
    }
}

// Exportar para uso global
window.ResponsiveImageHelper = ResponsiveImageHelper;

// Ejemplo de uso en datos de servicios actualizado:
/*
{
    "images": [
        {
            "basePath": "Imagenes/Ventaneria/Ventaneria1",
            "alt": "Ventanería 1",
            "caption": "Ventanería 1",
            "loading": "eager"
        }
    ]
}

// En el generador:
const imgHtml = ResponsiveImageHelper.generatePicture({
    basePath: image.basePath,
    alt: image.alt,
    caption: image.caption,
    loading: image.loading || 'lazy'
});
*/
