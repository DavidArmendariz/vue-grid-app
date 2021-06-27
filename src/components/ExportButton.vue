<template>
  <base-button @click="exportDealsData">
    <custom-icon icon="file-export" />
    Export
  </base-button>
</template>

<script>
import BaseButton from './BaseButton.vue';
import Utils from '../utils';

export default {
  props: ['fileName', 'model'],
  components: {
    BaseButton,
  },
  methods: {
    exportDealsData() {
      const { data } = this.model.getData();
      const encodedData = Utils.getEncodedCSVContent(data);
      const link = document.createElement('a');
      link.setAttribute('href', encodedData);
      link.setAttribute('download', this.fileName);
      link.click();
    },
  },
};
</script>
