<template>
  <base-button @click="exportData">
    <custom-icon icon="file-export" />
    Export
  </base-button>
</template>

<script>
import BaseButton from './BaseButton.vue';
import * as Utils from '../utils';

export default {
  props: ['fileName'],
  inject: ['model', 'uniqueLocalStorageKey'],
  components: {
    BaseButton,
  },
  methods: {
    exportData() {
      const currentFilters = Utils.getItemFromLocalStorage(`filters${this.uniqueLocalStorageKey}`, {});
      const { data } = this.model.getData(JSON.stringify({ ...currentFilters, all: true, isExport: true }));
      const encodedData = Utils.getCSVContent(data);
      const blob = new Blob([encodedData], { type: 'text/csv' });
      const link = document.createElement('a');
      const csvUrl = URL.createObjectURL(blob);
      link.href = csvUrl;
      link.style = 'visibility:hidden';
      link.download = this.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
