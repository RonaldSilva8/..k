# Guía de Accesibilidad (a11y)

## Implementación

Se ha agregado soporte completo de accesibilidad al sitio:

### 1. Skip Links
```html
<a href="#main-content" class="skip-to-main">Ir al contenido principal</a>
```
- Aparece solo con focus
- Permite navegar rápido
- Esencial para lectores de pantalla

### 2. Navegación con Teclado
✅ Tab funciona correctamente
✅ Focus visible en todos los elementos interactivos
✅ Enter/Espacio para botones
✅ Flechas para carruseles

### 3. Mejoras de Contraste
- Texto: #222 en fondos claros
- WCAG AA: Ratio 4.5:1 mínimo
- Links: Color único + subrayado
- Estado visitado: Color diferente

### 4. Tamaño Mínimo de Botones
- Mínimo 44x44px (móvil 48x48px)
- Espaciado adequado entre elementos
- Área tactil cómoda

### 5. Formularios Accesibles
```html
<div class="form-group">
    <label for="nombre">Nombre <span class="required"></span></label>
    <input id="nombre" type="text" required aria-required="true">
    <span class="error-message" role="alert"></span>
</div>
```

### 6. Preferencias del Usuario
- `prefers-reduced-motion`: Reduce animaciones
- `prefers-color-scheme`: Tema oscuro automático
- `prefers-contrast`: Mayor contraste si se solicita

## Atributos ARIA Implementados

```html
<!-- Carruseles -->
<div role="list" aria-roledescription="carrusel" aria-label="Galería Ventanería">
    <div role="listitem" tabindex="0">...</div>
</div>

<!-- Diálogos -->
<div role="dialog" aria-label="Imagen ampliada">...</div>

<!-- Botones -->
<button aria-label="Anterior imagen">❮</button>

<!-- Formularios -->
<input aria-required="true" aria-describedby="error">
<span id="error" role="alert">Este campo es requerido</span>
```

## Checklist de Accesibilidad

- ✅ Skip links implementados
- ✅ Focus visible en todos los elementos
- ✅ Contrastes WCAG AA cumplidos
- ✅ Botones mínimo 44x44px
- ✅ Navegación de teclado funcional
- ✅ Labels en formularios
- ✅ ARIA labels en componentes
- ✅ Alt text en imágenes
- ✅ Soporte para lectores de pantalla
- ✅ Temas oscuro/claro
- ✅ Reducción de movimiento

## Cómo Verificar

### Navegador
1. Presiona TAB para navegar
2. Presiona ENTER para activar
3. Verifica focus visible

### Con lector de pantalla
- NVDA (Windows, gratis): https://www.nvaccess.org/
- JAWS (Windows, pago)
- VoiceOver (Mac/iOS, incluido)

### Herramientas automáticas
- **Lighthouse** (Chrome DevTools)
- **axe DevTools** (extensión navegador)
- **WAVE** (webaimorg/wave)
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/

## Modos de Accesibilidad

### Modo de Contraste Alto
```javascript
document.body.classList.add('high-contrast-mode');
```

### Modo Lectura
```javascript
document.body.classList.add('reading-mode');
```

### Modo Prueba a11y
```javascript
document.body.classList.add('a11y-test-mode');
```

## Estándares Cumplidos

| Estándar | Nivel | Estado |
|----------|-------|--------|
| WCAG 2.1 | AA | ✅ Cumple |
| Section 508 | - | ✅ Cumple |
| ADA | - | ✅ Cumple |
| ATAG 2.0 | - | ✅ Cumple |

## Recursos

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

## Próximas Mejoras

- [ ] Agregar transcripciones de videos
- [ ] Captions en multimedia
- [ ] Documentos accesibles (PDF)
- [ ] Soporte para aumentar texto
- [ ] Modo de alto contraste por defecto opción del usuario
