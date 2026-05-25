# Guía de Formularios - FormValidator

## Descripción

`FormValidator` es un sistema completo de validación de formularios que:
- ✅ Valida en tiempo real
- ✅ Mensajes de error claros
- ✅ Accesible (ARIA)
- ✅ Envío a servidor
- ✅ Integración con Formspree/Email services
- ✅ Responsive y móvil-first

## Instalación

```html
<!-- Incluir JavaScript -->
<script src="scripts/components/form-validator.js" defer></script>

<!-- Incluir CSS ya incluido en styles/style.css -->
```

## Uso Básico

### HTML Simple
```html
<form id="contact-form" data-validate-form>
    <div class="form-group">
        <label for="name">Nombre <span class="required">*</span></label>
        <input 
            id="name" 
            name="name" 
            type="text" 
            data-validate="name"
            required
            aria-required="true">
    </div>

    <div class="form-group">
        <label for="email">Correo <span class="required">*</span></label>
        <input 
            id="email" 
            name="email" 
            type="email" 
            data-validate="email"
            required
            aria-required="true">
    </div>

    <div class="form-group">
        <label for="phone">Teléfono</label>
        <input 
            id="phone" 
            name="phone" 
            type="tel" 
            data-validate="phone">
    </div>

    <div class="form-group">
        <label for="message">Mensaje <span class="required">*</span></label>
        <textarea 
            id="message" 
            name="message" 
            data-validate="message"
            required
            aria-required="true"></textarea>
    </div>

    <div class="form-group submit-group">
        <button type="submit">Enviar</button>
        <button type="reset">Limpiar</button>
    </div>
</form>

<script>
    // Auto-inicialización con data-validate-form
    // O manual:
    const validator = new FormValidator('#contact-form');
</script>
```

## Tipos de Validación

| Validación | Atributo | Ejemplo |
|-----------|----------|---------|
| Email | `data-validate="email"` | Valida formato email |
| Teléfono | `data-validate="phone"` | Valida 7+ dígitos |
| Nombre | `data-validate="name"` | Mínimo 2 caracteres |
| Mensaje | `data-validate="message"` | Mínimo 10 caracteres |
| Requerido | `required` | Campo obligatorio |
| Checkbox | `data-validate="checkbox"` | Debe estar marcado |

## Configuración Avanzada

```javascript
const validator = new FormValidator('#contact-form', {
    submitUrl: 'https://formspree.io/f/YOUR_FORM_ID',
    showSuccessMessage: true,
    successMessage: '¡Mensaje enviado exitosamente!',
    errorMessage: 'Error al enviar. Intenta de nuevo.',
    onSuccess: (data) => console.log('Enviado:', data),
    onError: (error) => console.error('Error:', error)
});
```

## Métodos Disponibles

```javascript
// Validar campo individual
validator.validateField(inputElement);

// Validar formulario completo
const isValid = validator.validateForm();

// Obtener datos del formulario
const data = validator.getFormData();
// {name: "Juan", email: "juan@example.com", ...}

// Rellenar formulario
validator.setFormData({
    name: "Juan",
    email: "juan@example.com"
});

// Resetear
validator.resetForm();

// Deshabilitar botón submit
validator.setSubmitButtonDisabled(true);

// Agregar validación custom
validator.addValidationRule('customRule', {
    validate: (value) => value.length > 5,
    message: 'Debe tener más de 5 caracteres'
});
```

## Validación Custom

```javascript
// Agregar regla personalizada
validator.addValidationRule('zipcode', {
    validate: (value) => /^\d{5}(-\d{4})?$/.test(value),
    message: 'Código postal inválido'
});

// Usar en HTML
<input data-validate="zipcode" required>
```

## Integración con Servicios Email

### Opción 1: Formspree
1. Ve a https://formspree.io
2. Crea formulario nuevo
3. Obtén tu ID (ej: `YOUR_FORM_ID`)
4. Usa en validador:

```javascript
new FormValidator('#contact-form', {
    submitUrl: 'https://formspree.io/f/YOUR_FORM_ID'
});
```

### Opción 2: Netlify Forms
Si tu sitio está en Netlify:
```html
<form id="contact-form" name="contact" method="POST" netlify>
    <!-- campos del formulario -->
</form>
```

### Opción 3: Backend Propio
```javascript
new FormValidator('#contact-form', {
    submitUrl: '/api/contact',
    onSuccess: () => {
        // Redirigir, mostrar mensaje, etc
    }
});
```

## Estilos Personalizados

### Campos con Error
```css
input.error {
    border-color: #d32f2f;
    background: #fff5f5;
}
```

### Campos Exitosos
```css
input.success {
    border-color: #2e7d32;
    background: #f1f8f4;
}
```

### Mensaje de Éxito
```html
<div class="form-message success-message">
    <svg>...</svg>
    <span>¡Formulario enviado con éxito!</span>
</div>
```

### Mensaje de Error
```html
<div class="form-message error-message-container">
    <svg>...</svg>
    <span>Error al enviar el formulario</span>
</div>
```

## Ejemplo Completo: Formulario de Cotización

```html
<form id="quote-form" data-validate-form>
    <div class="form-section">
        <h3>Información de Contacto</h3>
        
        <div class="form-field-group">
            <div class="form-group">
                <label for="company">Empresa <span class="required">*</span></label>
                <input 
                    id="company" 
                    name="company" 
                    type="text"
                    data-validate="name"
                    required>
            </div>
            
            <div class="form-group">
                <label for="contact-name">Nombre <span class="required">*</span></label>
                <input 
                    id="contact-name" 
                    name="contact_name" 
                    type="text"
                    data-validate="name"
                    required>
            </div>
        </div>

        <div class="form-field-group">
            <div class="form-group">
                <label for="email">Correo <span class="required">*</span></label>
                <input 
                    id="email" 
                    name="email" 
                    type="email"
                    data-validate="email"
                    required>
            </div>
            
            <div class="form-group">
                <label for="phone">Teléfono <span class="required">*</span></label>
                <input 
                    id="phone" 
                    name="phone" 
                    type="tel"
                    data-validate="phone"
                    required>
            </div>
        </div>
    </div>

    <div class="form-section">
        <h3>Detalles del Proyecto</h3>
        
        <div class="form-group">
            <label for="service">Servicio Interesado <span class="required">*</span></label>
            <select id="service" name="service" required>
                <option value="">Selecciona un servicio</option>
                <option value="ventaneria">Ventanería</option>
                <option value="fachadas">Fachadas</option>
                <option value="divisiones">Divisiones de Baño</option>
                <option value="acusticas">Ventanas Acústicas</option>
            </select>
        </div>

        <div class="form-group">
            <label for="project-description">Descripción del Proyecto <span class="required">*</span></label>
            <textarea 
                id="project-description" 
                name="project_description"
                data-validate="message"
                required
                placeholder="Cuéntanos sobre tu proyecto..."></textarea>
            <span class="form-help">Mínimo 10 caracteres</span>
        </div>

        <div class="form-group checkbox">
            <input 
                id="terms" 
                name="terms" 
                type="checkbox"
                data-validate="checkbox"
                required>
            <label for="terms">Acepto términos y condiciones <span class="required">*</span></label>
        </div>
    </div>

    <div class="form-group submit-group">
        <button type="submit">Solicitar Cotización</button>
        <button type="reset">Limpiar</button>
    </div>
</form>

<script>
    const quoteValidator = new FormValidator('#quote-form', {
        submitUrl: 'https://formspree.io/f/YOUR_FORM_ID',
        successMessage: '¡Cotización solicitada! Te contactaremos pronto.'
    });
</script>
```

## Accesibilidad

✅ Labels asociados con inputs
✅ Atributos aria-required
✅ Mensajes con role="alert"
✅ Validación en tempo real
✅ Mensajes de error descriptivos
✅ Tamaño mínimo de botones (44x44px)
✅ Focus visible
✅ Soporte para screen readers

## Debugging

```javascript
// Ver datos del formulario
console.log(validator.getFormData());

// Validar manualmente
if (validator.validateForm()) {
    console.log('Formulario válido');
}

// Ver campos con error
document.querySelectorAll('input.error').forEach(field => {
    console.log(field.name, field.value);
});
```

## Soporte de Navegadores

- ✅ Chrome 50+
- ✅ Firefox 45+
- ✅ Safari 10+
- ✅ Edge 15+
- ✅ iOS Safari 10+
- ✅ Android Browser 5+

## Próximas Mejoras

- [ ] Validación asíncrona (verificar email en servidor)
- [ ] ReCAPTCHA integration
- [ ] Carga de archivos
- [ ] Multi-paso (wizard)
- [ ] Guardado automático
- [ ] Integración con analytics
