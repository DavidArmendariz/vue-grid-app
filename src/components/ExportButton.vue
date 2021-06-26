<template>
  <button @click="exportDealsData" class="export-button">
    <custom-icon icon="file-export" />
    Export
  </button>
</template>

<script>
export default {
  inject: ['deals'],
  methods: {
    exportDealsData() {
      let csvContent = 'data:text/csv;charset=utf-8,';
      const { data } = this.deals.getDeals({ all: true });
      csvContent += [Object.keys(data[0]).join(';'), ...data.map((row) => Object.values(row).join(';'))]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '');
      const encodedData = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedData);
      link.setAttribute('download', 'deals_data.csv');
      link.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.export-button {
  padding: 10px;
}
</style>
