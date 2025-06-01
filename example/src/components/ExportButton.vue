<template>
  <v-menu>
    <template v-slot:activator="{ props: menuActivatorProps }">
      <v-icon v-bind="menuActivatorProps" icon="mdi-download"></v-icon>
    </template>
    <v-list>
      <v-list-item value="png" @click="handleExport('png')">
        <v-list-item-title>Export PNG</v-list-item-title>
      </v-list-item>
      <v-list-item value="jpeg" @click="handleExport('jpeg')">
        <v-list-item-title>Export JPEG</v-list-item-title>
      </v-list-item>
      <v-list-item value="svg" @click="handleExport('svg')">
        <v-list-item-title>Export SVG</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import domtoimage from 'dom-to-image-more';

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link); // Required for Firefox for the link to be clickable
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const downloadDataURL = (dataURL: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
};

export default defineComponent({
  name: 'ExportButton',
  props: {
    element: {
      type: Object as PropType<HTMLElement>,
      required: true
    },
    filenamePrefix: { // Prop optionnelle pour le nom de fichier
      type: String,
      default: 'profile'
    }
  },
  setup(props) {
    const handleExport = async (format: 'png' | 'jpeg' | 'svg' | 'html') => {
      if (!props.element) {
        console.error("Element to export is not available.");
        // Tu pourrais ici émettre un événement ou afficher une notification à l'utilisateur
        return;
      }

      const elementToCapture = props.element;
      const filename = `${props.filenamePrefix}.${format}`;

      try {
        switch (format) {
          case 'png': {
            // domtoimage.toBlob() génère un blob PNG par défaut.
            const pngBlob = await domtoimage.toBlob(elementToCapture);
            downloadBlob(pngBlob, filename);
            break;
          }
          case 'jpeg': {
            // Pour JPEG, utiliser toJpeg pour contrôler la qualité et la couleur de fond (JPEG ne supporte pas la transparence).
            const jpegDataUrl = await domtoimage.toJpeg(elementToCapture, {
              quality: 0.95, // Qualité du JPEG (0.0 à 1.0)
              bgcolor: '#ffffff' // Couleur de fond, car JPEG ne gère pas la transparence
            });
            downloadDataURL(jpegDataUrl, filename);
            break;
          }
          case 'svg': {
            // domtoimage.toSvg() retourne une data URL.
            // Convertir en Blob pour un téléchargement plus robuste, notamment pour le type MIME.
            const svgDataUrl = await domtoimage.toSvg(elementToCapture);
            // Récupérer le contenu SVG sous forme de chaîne
            const response = await fetch(svgDataUrl);
            const svgText = await response.text();
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
            downloadBlob(svgBlob, filename);
            break;
          }
          default: {
            console.error('Unsupported export format:', format);
            // Gérer le cas d'un format non supporté
            return;
          }
        }
      } catch (error: any) {
        console.error(`Error exporting profile as ${format}:`, error);
        // Gérer les erreurs d'exportation (par exemple, afficher une notification)
      }
    };

    return {
      handleExport
    };
  },
});
</script>

<style scoped>
/* Ajoute ici du style si nécessaire pour ton icône ou menu */
.v-icon {
  cursor: pointer;
}
</style>
