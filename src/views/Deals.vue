<template>
  <div class="deals">
    <div class="header">
      <search-deals />
      <div class="buttons">
        <columns-filter />
        <export-button />
      </div>
    </div>
    <div>
      <grid :filteredData="filteredData" />
    </div>
    <pagination :paginationCount="paginationCount" />
  </div>
</template>

<script>
import Deals from '../models/deals';
import SearchDeals from '../components/SearchDeals.vue';
import ExportButton from '../components/ExportButton.vue';
import ColumnsFilter from '../components/ColumnsFilter.vue';
import Grid from '../components/Grid.vue';
import Pagination from '../components/Pagination.vue';

export default {
  components: {
    SearchDeals,
    ExportButton,
    ColumnsFilter,
    Grid,
    Pagination,
  },
  data() {
    return {
      deals: new Deals(),
      filteredData: [],
      paginationCount: 0,
    };
  },
  provide() {
    return { deals: this.deals };
  },
  mounted() {
    const { data } = this.deals.getDeals();
    this.filteredData = data;
    this.paginationCount = 100;
  },
};
</script>

<style lang="scss" scoped>
.deals {
  padding: 1rem;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.buttons {
  margin-left: auto;
}
</style>
