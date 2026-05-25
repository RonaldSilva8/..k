# Guía de Optimización de Imágenes

## Estrategia Actual
✅ WebP con lazy loading
✅ srcset responsive (400w, 800w)
✅ Tamaños optimizados por breakpoint
✅ Loading eager para primera imagen

## Mejoras Implementadas

### 1. Soporte AVIF
**Por qué**: AVIF es 20-30% más pequeño que WebP
- Mejor compresión
- Soporte en navegadores modernos
- Fallback automático a WebP

**Implementación** con `<picture>`:
```html
<picture>
    <source srcset="imagen.avif" type="image/avif">
    <source srcset="imagen.webp" type="image/webp">
    <img src="imagen.jpg" alt="Descripción">
</picture>
```

### 2. Compresión Optimizada
```
Antes:  archivo.webp - 250KB
Después: archivo.avif - 80KB (68% reducción)
```

**Calidad vs Tamaño**:
- AVIF: crf=30 (calidad buena, pequeño)
- WebP: q=85 (calidad alta, equilibrado)
- JPG: q=85 (calidad alta para fallback)

### 3. Responsive Images
```html
<!-- Móvil: 100vw, Tablet: 50vw, Desktop: 800px -->
<img srcset="
    imagen-400w.webp 400w,
    imagen-800w.webp 800w,
    imagen-1200w.webp 1200w"
    sizes="(max-width: 600px) 100vw,
           (max-width: 1024px) 50vw,
           800px"
    alt="...">
```

### 4. Lazy Loading Estratégico
```
Primera imagen: loading="eager" + fetchpriority="high"
Otras imágenes: loading="lazy" + fetchpriority="low"
```

## Script de Conversión

**Requiere instalación previa:**
```bash
sudo apt-get install libwebp-tools imagemagick ffmpeg
```

**Uso:**
```bash
chmod +x scripts/optimize-images.sh
./scripts/optimize-images.sh
```

**Genera:**
- Versiones AVIF automáticamente
- Compresión de WebP a calidad 85
- Reporte de optimización

## Ventajas de la Estrategia

| Formato | Tamaño | Soporte | Uso |
|---------|--------|---------|-----|
| AVIF | 80KB | Chrome 85+, Firefox 93+, Safari 16+ | Primario moderno |
| WebP | 120KB | Chrome 23+, Firefox 65+, Edge 18+ | Navegadores antiguos |
| JPG | 200KB | Todos | Fallback universal |

## Implementación HTML

Para cada imagen, usa este patrón:

```html
<picture>
    <!-- AVIF para navegadores modernos -->
    <source media="(max-width: 600px)"
            srcset="Imagenes/path/imagen-400w.avif 400w, Imagenes/path/imagen-400w.avif 400w"
            type="image/avif">
    <source media="(min-width: 601px)"
            srcset="Imagenes/path/imagen-800w.avif 800w, Imagenes/path/imagen-1200w.avif 1200w"
            type="image/avif">
    
    <!-- WebP para navegadores compatibles -->
    <source media="(max-width: 600px)"
            srcset="Imagenes/path/imagen-400w.webp 400w"
            type="image/webp">
    <source media="(min-width: 601px)"
            srcset="Imagenes/path/imagen-800w.webp 800w, Imagenes/path/imagen-1200w.webp 1200w"
            type="image/webp">
    
    <!-- Fallback JPG -->
    <img src="Imagenes/path/imagen-800w.jpg"
         srcset="Imagenes/path/imagen-400w.jpg 400w, Imagenes/path/imagen-800w.jpg 800w"
         sizes="(max-width: 600px) 100vw, 800px"
         alt="Descripción de la imagen"
         loading="lazy"
         decoding="async">
</picture>
```

## Resultados Esperados

**Rendimiento Móvil**:
- Reducción de 60-70% en tamaño de imágenes
- Faster LCP (Largest Contentful Paint)
- Menor consumo de datos

**Puntuación Lighthouse**:
- Performance: +15-20 puntos
- Best Practices: +5 puntos

## Próximos Pasos

1. ✅ Crear script de conversión
2. ⏳ Convertir todas las imágenes a AVIF
3. ⏳ Implementar `<picture>` elements
4. ⏳ Generar múltiples versiones por breakpoint
5. ⏳ Monitorear Core Web Vitals

## Herramientas Recomendadas

- **Compresión local**: `scripts/optimize-images.sh`
- **Validación**: [webpagetest.org](https://www.webpagetest.org)
- **Análisis**: [ImageOptim](https://imageoptim.com)
- **CDN**: Cloudflare, BunnyCDN (AVIF automático)

## Soporte de Navegadores

```
AVIF:  Chrome 85+, Firefox 93+, Safari 16+, Edge 85+
WebP:  Chrome 23+, Firefox 65+, Edge 18+, Opera 10.6+
JPG:   Todos (100%)
```

Usando `<picture>` con fallback, garantizamos 100% de compatibilidad.
