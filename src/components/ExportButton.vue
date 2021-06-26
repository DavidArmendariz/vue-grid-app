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
  components: {
    BaseButton,
  },
  inject: ['deals'],
  methods: {
    exportDealsData() {
      const { data } = this.deals.getDeals({ all: true });
      const encodedData = Utils.getEncodedCSVContent(data);
      const link = document.createElement('a');
      link.setAttribute('href', encodedData);
      link.setAttribute('download', 'deals_data.csv');
      link.click();
    },
  },
};
</script>
