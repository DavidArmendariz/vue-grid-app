<template>
  <base-button @click="exportDealsData">
    <custom-icon icon="file-export" />
    Export
  </base-button>
</template>

<script>
import BaseButton from './BaseButton.vue';
import * as Utils from '../utils';

export default {
  props: ['fileName'],
  inject: ['model'],
  components: {
    BaseButton,
  },
  methods: {
    exportDealsData() {
      const { data } = this.model.getData({ all: true });
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
