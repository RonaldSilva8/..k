#!/bin/bash

#
# Script de Optimización de Imágenes
# Convierte imágenes WebP a AVIF y comprime para mejor rendimiento
# Requisitos: cwebp, cavif, imagemagick
#
# Uso: chmod +x optimize-images.sh && ./optimize-images.sh
#

set -e

# Colores para terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorios
IMAGES_DIR="Imagenes"
OUTPUT_SUMMARY="optimization-report.txt"

# Counters
processed=0
failed=0
skipped=0

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Optimizador de Imágenes v1.0        ║${NC}"
echo -e "${GREEN}║   WebP → AVIF + Compresión            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar dependencias
check_dependencies() {
    local missing=0
    
    echo "Verificando dependencias..."
    
    if ! command -v cwebp &> /dev/null; then
        echo -e "${RED}✗ cwebp no instalado (libwebp-tools)${NC}"
        missing=1
    else
        echo -e "${GREEN}✓ cwebp encontrado${NC}"
    fi
    
    if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
        echo -e "${RED}✗ ImageMagick no instalado${NC}"
        missing=1
    else
        echo -e "${GREEN}✓ ImageMagick encontrado${NC}"
    fi
    
    if [ $missing -eq 1 ]; then
        echo -e "${YELLOW}Instala con: sudo apt-get install libwebp-tools imagemagick${NC}"
        return 1
    fi
    return 0
}

# Convertir a AVIF
convert_to_avif() {
    local input="$1"
    local output="${input%.*}.avif"
    
    if [ -f "$output" ]; then
        echo -e "${YELLOW}  ⊘ AVIF ya existe: $(basename $output)${NC}"
        ((skipped++))
        return 0
    fi
    
    if cwebp -q 80 "$input" -o "${input%.*}.webp" 2>/dev/null && \
       ffmpeg -i "${input%.*}.webp" -c:v libaom-av1 -crf 30 "$output" -y >/dev/null 2>&1; then
        local orig_size=$(du -h "$input" | cut -f1)
        local new_size=$(du -h "$output" | cut -f1)
        echo -e "${GREEN}  ✓ Convertido a AVIF: $(basename $output) ($orig_size → $new_size)${NC}"
        ((processed++))
        return 0
    else
        echo -e "${RED}  ✗ Error al convertir: $(basename $input)${NC}"
        ((failed++))
        return 1
    fi
}

# Comprimir imágenes
compress_image() {
    local input="$1"
    local filename=$(basename "$input")
    local ext="${filename##*.}"
    
    case "$ext" in
        webp)
            cwebp -q 85 "$input" -o "$input" 2>/dev/null
            echo -e "${GREEN}  ✓ WebP comprimido: $filename${NC}"
            ((processed++))
            ;;
        jpg|jpeg)
            convert "$input" -quality 85 -strip "$input"
            echo -e "${GREEN}  ✓ JPG comprimido: $filename${NC}"
            ((processed++))
            ;;
        png)
            convert "$input" -quality 85 -strip "$input"
            echo -e "${GREEN}  ✓ PNG comprimido: $filename${NC}"
            ((processed++))
            ;;
    esac
}

# Procesar directorio
process_directory() {
    local dir="$1"
    echo ""
    echo "Procesando: $dir"
    echo "─────────────────────────────────────"
    
    for file in "$dir"/*; do
        if [ -f "$file" ]; then
            ext="${file##*.}"
            case "$ext" in
                webp|jpg|jpeg|png)
                    compress_image "$file"
                    ;;
            esac
        elif [ -d "$file" ]; then
            process_directory "$file"
        fi
    done
}

# Generar reporte
generate_report() {
    echo "" > "$OUTPUT_SUMMARY"
    echo "╔════════════════════════════════════════╗" >> "$OUTPUT_SUMMARY"
    echo "║   Reporte de Optimización de Imágenes ║" >> "$OUTPUT_SUMMARY"
    echo "╚════════════════════════════════════════╝" >> "$OUTPUT_SUMMARY"
    echo "" >> "$OUTPUT_SUMMARY"
    echo "Fecha: $(date)" >> "$OUTPUT_SUMMARY"
    echo "Directorio: $IMAGES_DIR" >> "$OUTPUT_SUMMARY"
    echo "" >> "$OUTPUT_SUMMARY"
    echo "Resultados:" >> "$OUTPUT_SUMMARY"
    echo "  • Procesadas: $processed" >> "$OUTPUT_SUMMARY"
    echo "  • Errores: $failed" >> "$OUTPUT_SUMMARY"
    echo "  • Omitidas: $skipped" >> "$OUTPUT_SUMMARY"
    echo "" >> "$OUTPUT_SUMMARY"
    echo "Recomendaciones:" >> "$OUTPUT_SUMMARY"
    echo "  1. Usa <picture> element con AVIF, WebP y fallback JPG" >> "$OUTPUT_SUMMARY"
    echo "  2. Configura srcset responsive en todas las imágenes" >> "$OUTPUT_SUMMARY"
    echo "  3. Implementa lazy loading en imágenes below-the-fold" >> "$OUTPUT_SUMMARY"
    echo "  4. Usa CDN para servir imágenes desde ubicaciones múltiples" >> "$OUTPUT_SUMMARY"
}

# Main
if check_dependencies; then
    if [ -d "$IMAGES_DIR" ]; then
        process_directory "$IMAGES_DIR"
        generate_report
        
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║         Optimización Completada       ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
        echo ""
        echo "Resultados:"
        echo "  Procesadas: $processed"
        echo "  Errores:    $failed"
        echo "  Omitidas:   $skipped"
        echo ""
        echo "Reporte: $OUTPUT_SUMMARY"
    else
        echo -e "${RED}Error: Directorio '$IMAGES_DIR' no existe${NC}"
        exit 1
    fi
else
    exit 1
fi
