/**
 * FormValidator
 * Sistema modular de validación de formularios
 * Soporta: email, teléfono, nombre, mensaje, selects, etc.
 */

class FormValidator {
    constructor(formSelector, options = {}) {
        this.form = null;

        if (typeof formSelector === 'string') {
            this.form = document.querySelector(formSelector);
        } else if (formSelector instanceof HTMLElement && formSelector.tagName === 'FORM') {
            this.form = formSelector;
        } else if (formSelector && typeof formSelector === 'object' && formSelector.nodeType === 1 && formSelector.tagName === 'FORM') {
            this.form = formSelector;
        } else {
            console.error('FormValidator requiere un selector o elemento FORM válido');
            return;
        }

        if (!this.form) {
            console.error(`Formulario no encontrado: ${formSelector}`);
            return;
        }

        this.options = {
            submitUrl: options.submitUrl || '',
            fallbackEmail: options.fallbackEmail || 'estructualuvid@hotmail.es',
            showSuccessMessage: options.showSuccessMessage !== false,
            successMessage: options.successMessage || '¡Formulario enviado con éxito!',
            errorMessage: options.errorMessage || 'Error al enviar el formulario. Por favor, intenta de nuevo.',
            ...options
        };

        this.validationRules = this.initializeValidationRules();
        this.init();
    }

    /**
     * Inicializa reglas de validación
     */
    initializeValidationRules() {
        return {
            email: {
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Ingresa un correo electrónico válido'
            },
            phone: {
                validate: (value) => /^[\d\s\-\+\(\)]{7,}$/.test(value.replace(/\s/g, '')),
                message: 'Ingresa un teléfono válido (mínimo 7 dígitos)'
            },
            name: {
                validate: (value) => value.trim().length >= 2,
                message: 'El nombre debe tener al menos 2 caracteres'
            },
            message: {
                validate: (value) => value.trim().length >= 10,
                message: 'El mensaje debe tener al menos 10 caracteres'
            },
            required: {
                validate: (value) => value.trim().length > 0,
                message: 'Este campo es requerido'
            },
            checkbox: {
                validate: (element) => element.checked,
                message: 'Debes aceptar los términos y condiciones'
            }
        };
    }

    /**
     * Inicializa el validador
     */
    init() {
        // Prevenir envío por defecto
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Validación en tiempo real
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    /**
     * Valida un campo individual
     */
    validateField(field) {
        const fieldType = field.getAttribute('data-validate') || field.type;
        const isRequired = field.hasAttribute('required');
        const isEmpty = field.value.trim().length === 0;

        const formGroup = field.closest('.form-group');
        let errorContainer = formGroup?.querySelector('.error-message');

        // Si está vacío pero no es requerido, es válido
        if (isEmpty && !isRequired) {
            this.clearError(field);
            return true;
        }

        // Validar tipo específico
        if (!isEmpty && this.validationRules[fieldType]) {
            const rule = this.validationRules[fieldType];
            const isValid = fieldType === 'checkbox' 
                ? rule.validate(field) 
                : rule.validate(field.value);

            if (!isValid) {
                if (!errorContainer) {
                    errorContainer = document.createElement('span');
                    errorContainer.className = 'error-message';
                    errorContainer.setAttribute('role', 'alert');
                    formGroup?.appendChild(errorContainer);
                }
                errorContainer.textContent = rule.message;
                field.classList.add('error');
                field.setAttribute('aria-invalid', 'true');
                return false;
            }
        }

        // Validar requerido
        if (isRequired && isEmpty) {
            if (!errorContainer) {
                errorContainer = document.createElement('span');
                errorContainer.className = 'error-message';
                errorContainer.setAttribute('role', 'alert');
                formGroup?.appendChild(errorContainer);
            }
            errorContainer.textContent = this.validationRules.required.message;
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            return false;
        }

        this.clearError(field);
        return true;
    }

    /**
     * Limpia errores de un campo
     */
    clearError(field) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        const formGroup = field.closest('.form-group');
        const errorContainer = formGroup?.querySelector('.error-message');
        if (errorContainer) {
            errorContainer.textContent = '';
        }
    }

    /**
     * Valida todos los campos del formulario
     */
    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Validar
        if (!this.validateForm()) {
            console.warn('Formulario contiene errores');
            return;
        }

        // Enviar
        try {
            const result = await this.submitForm();

            if (result && result.status === 'mailto-fallback') {
                this.showSuccess('Se abrió tu cliente de correo. Envía el mensaje para completar el contacto.');
                this.form.reset();
                return;
            }

            this.showSuccess();
            this.form.reset();
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            this.showError(error.message);
        }
    }

    /**
     * Envía el formulario al servidor
     */
    async submitForm() {
        const formData = new FormData(this.form);
        const url = this.options.submitUrl;

        if (!url || url.includes('YOUR_FORM_ID')) {
            const mailtoLink = this.createMailtoLink(formData);
            window.open(mailtoLink, '_blank');
            return { status: 'mailto-fallback' };
        }

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Construye un enlace mailto para fallback en entornos estáticos
     */
    createMailtoLink(formData) {
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const subject = encodeURIComponent(data.subject || 'Solicitud de contacto desde Estructualuvid SAS');
        const bodyLines = [
            `Nombre: ${data.nombre || data.name || ''}`,
            `Email: ${data.email || ''}`,
            `Teléfono: ${data.telefono || data.phone || ''}`,
            '',
            `${data.mensaje || data.message || ''}`
        ].filter(Boolean);

        const body = encodeURIComponent(bodyLines.join('\n'));
        return `mailto:${this.options.fallbackEmail}?subject=${subject}&body=${body}`;
    }

    /**
     * Muestra mensaje de éxito
     */
    showSuccess() {
        if (!this.options.showSuccessMessage) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message success-message';
        messageDiv.setAttribute('role', 'status');
        messageDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${this.options.successMessage}</span>
        `;

        this.form.insertBefore(messageDiv, this.form.firstChild);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    /**
     * Muestra mensaje de error
     */
    showError(message = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message error-message-container';
        messageDiv.setAttribute('role', 'alert');
        messageDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>${message || this.options.errorMessage}</span>
        `;

        this.form.insertBefore(messageDiv, this.form.firstChild);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    /**
     * Obtiene todos los datos del formulario como objeto
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        return data;
    }

    /**
     * Rellena campos del formulario
     */
    setFormData(data) {
        Object.entries(data).forEach(([name, value]) => {
            const field = this.form.querySelector(`[name="${name}"]`);
            if (field) {
                field.value = value;
            }
        });
    }

    /**
     * Resetea el formulario
     */
    resetForm() {
        this.form.reset();
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            this.clearError(field);
        });
    }

    /**
     * Habilita/deshabilita el botón de envío
     */
    setSubmitButtonDisabled(disabled) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = disabled;
        }
    }

    /**
     * Agrega una regla de validación custom
     */
    addValidationRule(name, rule) {
        this.validationRules[name] = rule;
    }
}

// Exportar para uso global
window.FormValidator = FormValidator;

// Auto-inicialización de formularios con data-validate-form
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-validate-form]').forEach(form => {
        new FormValidator(form);
    });
});
