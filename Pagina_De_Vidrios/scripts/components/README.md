# Sistema de Componentes - Guía de Uso

## Descripción General

El `ServiceComponentGenerator` es una clase JavaScript que automatiza la generación de componentes de servicios. Elimina la repetición de HTML y facilita mantener consistencia en el diseño.

## Archivo JSON (`data/services.json`)

Estructura centralizada de todos los servicios:
- **id**: Identificador único del servicio
- **title**: Título visible
- **description**: Descripción breve
- **images**: Array de imágenes del carrusel
- **details**: Array de secciones con características y ventajas

### Ejemplo de estructura JSON:
```json
{
  "services": [
    {
      "id": "ventaneria",
      "title": "Ventanería",
      "description": "...",
      "images": [
        {
          "src": "Imagenes/Ventaneria/Ventaneria1.webp",
          "alt": "Ventanería 1",
          "caption": "Ventanería 1",
          "loading": "eager"
        }
      ],
      "details": [
        {
          "title": "Características",
          "items": ["Item 1", "Item 2"]
        }
      ]
    }
  ]
}
```

## Uso en HTML

### Opción 1: Renderizar todos los servicios automáticamente
```html
<main id="services-container"></main>

<script src="scripts/components/service-generator.js" defer></script>
```

### Opción 2: Control manual desde JavaScript
```javascript
const generator = new ServiceComponentGenerator('data/services.json');

// Cargar servicios
await generator.loadServices();

// Renderizar en contenedor
await generator.renderServices('services-container');
```

### Opción 3: Agregar nuevo servicio
```javascript
const newService = {
    id: "nuevo-servicio",
    title: "Nuevo Servicio",
    description: "...",
    images: [...],
    details: [...]
};

generator.addService(newService, 'services-container');
```

## Métodos disponibles

| Método | Parámetros | Descripción |
|--------|-----------|------------|
| `loadServices()` | - | Carga servicios desde JSON |
| `renderServices(containerId)` | string | Renderiza todos en un contenedor |
| `addService(service, containerId)` | Object, string | Agrega un nuevo servicio |
| `updateService(id, data, containerId)` | string, Object, string | Actualiza un servicio existente |
| `getService(id)` | string | Obtiene un servicio específico |
| `getAllServices()` | - | Retorna copia de todos los servicios |
| `filterServices(criterion)` | function | Filtra servicios con función custom |

## Ventajas

✅ **Sin repetición**: Cambiar una imagen requiere actualizar solo el JSON
✅ **Fácil mantenimiento**: Un solo lugar donde editar cada servicio
✅ **Escalable**: Agregar 100 servicios es tan fácil como agregar 1
✅ **Dinámico**: Cargar servicios desde API en lugar de JSON es trivial
✅ **Reutilizable**: El componente se puede usar en múltiples páginas
✅ **SEO-friendly**: El HTML generado incluye atributos de accesibilidad

## Ejemplo Completo

**HTML (simplificado):**
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <header>...</header>
    <main id="services-container"></main>
    <footer>...</footer>
    
    <script src="scripts/general/lazy-load.js" defer></script>
    <script src="scripts/general/script.js" defer></script>
    <script src="scripts/services/carousel.js" defer></script>
    <script src="scripts/components/service-generator.js" defer></script>
</body>
</html>
```

**Para agregar un nuevo servicio:**
1. Edita `data/services.json`
2. Agrega el nuevo objeto de servicio
3. ¡Listo! Automáticamente aparecerá en la página

## Próximas Mejoras

- [ ] Cargar servicios desde API REST en lugar de JSON estático
- [ ] Agregar sistema de filtros dinámicos
- [ ] Caché de servicios en localStorage
- [ ] Validación de datos JSON
- [ ] Exportación de servicios a formatos diferentes (CSV, etc.)

## Troubleshooting

**P: Las imágenes no se cargan**
- R: Verifica que las rutas en `data/services.json` son correctas

**P: El carrusel no funciona**
- R: Asegúrate que los scripts `carousel.js` y `lazy-load.js` estén cargados

**P: Los estilos no se aplican**
- R: Verifica que `styles/style.css` está cargado antes del script

**P: Quiero cargar desde una API en lugar de JSON**
- R: Modifica el método `loadServices()` en la clase
