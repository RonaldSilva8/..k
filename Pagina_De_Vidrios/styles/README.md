# Estructura CSS Modularizada

## Descripción
El CSS ha sido separado en módulos independientes para mejorar el mantenimiento y escalabilidad del proyecto.

## Estructura de Archivos

```
/styles
├── style.css           # Archivo principal (importa todos los demás)
├── base.css           # Reset, variables CSS, estilos base globales
├── header.css         # Header, navegación y estilos relacionados
├── components.css     # Botones, cards, modales, utilidades
├── carousel.css       # Carrusel, galerías, detalles de servicios
├── sections.css       # Hero, stats, testimonios, FAQ
├── footer.css         # Footer y redes sociales
└── responsive.css     # Media queries y estilos responsivos
```

## Contenido de Cada Módulo

### 1. **base.css** (Líneas: ~80)
- Reset CSS universal (`*{box-sizing}`)
- Estilos de HTML y BODY
- Variables CSS globales (`:root`)
- Animaciones clave (`@keyframes`)
- Estilos de focus para accesibilidad

### 2. **header.css** (Líneas: ~120)
- Estilos del header fijo
- Logo del sitio
- Navegación principal
- Transiciones y efectos hover

### 3. **components.css** (Líneas: ~240)
- Cards y grid layout
- Botones primarios y secundarios
- Modal overlay para imágenes ampliadas
- Botón flotante WhatsApp
- Lazy loading

### 4. **carousel.css** (Líneas: ~130)
- Carrusel de imágenes
- Controles prev/next
- Grid de detalles de servicios
- Captions de imágenes

### 5. **sections.css** (Líneas: ~220)
- Hero section
- Galería de imágenes
- Grid de estadísticas
- Testimonios
- FAQ

### 6. **footer.css** (Líneas: ~180)
- Footer principal
- Links sociales
- Tarjetas de contacto
- Copyright

### 7. **responsive.css** (Líneas: ~300)
- Media queries para tabletas (800px)
- Media queries para móviles (600px)
- Media queries para teléfonos pequeños (480px)
- Ajustes de responsive

## Ventajas de la Modularización

✅ **Mejor Mantenimiento**: Cada módulo tiene una responsabilidad clara
✅ **Fácil de Escalar**: Agregar nuevos componentes es más ordenado
✅ **Reutilizable**: Variables CSS globales disponibles en todos los módulos
✅ **Rendimiento**: Es posible optimizar/minificar cada archivo por separado
✅ **Colaboración**: Múltiples personas pueden trabajar en diferentes módulos
✅ **Debugging**: Errores más fáciles de localizar

## Variables CSS Disponibles

En `base.css` se definen variables globales que puedes usar en cualquier módulo:

```css
--primary-color: #0077ff
--primary-light: #00b4ff
--dark-bg: #111
--dark-secondary: #1a1a1a
--light-bg: #f5f5f5
--white: #fff
--text-dark: #111
--text-secondary: #555
--text-muted: #999
--shadow-sm, --shadow-md, --shadow-lg
--transition: 0.2s
--transition-smooth: 0.45s cubic-bezier(0.2, 0.9, 0.2, 1)
```

## Cómo Usar

### Para agregar un nuevo componente:
1. Crea el CSS en el módulo correspondiente
2. Si es un nuevo tipo de componente, considera crear un nuevo módulo
3. Si necesitas una nueva variable, añádela en `base.css`

### Para cambiar colores globales:
Modifica las variables en `base.css` - los cambios se aplicarán automáticamente.

### Para responsive:
Añade las media queries en `responsive.css` manteniendo la estructura actual.

## Migración Completada

- ✅ CSS modularizado desde style.css original
- ✅ Variables CSS globales implementadas
- ✅ HTML files actualizados para importar desde `/styles/style.css`
- ✅ Funcionalidad 100% preservada
- ✅ Rendimiento mantenido (imports CSS son eficientes)

## Próximos Pasos Recomendados

1. **Reducir Repetición HTML**: Usar componentes JavaScript
2. **Optimizar Imágenes**: Agregar soporte AVIF
3. **Mejorar Accesibilidad**: Skip links, ARIA labels
4. **Formularios**: Validación y envío de emails
5. **Animaciones**: Scroll animations, microinteracciones
6. **Galería Premium**: Masonry layout, filtros
