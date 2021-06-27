<template>
  <div class="deals">
    <div class="header">
      <search-deals>
        <template v-slot:title>
          <h2>Search Deals</h2>
        </template>
      </search-deals>
      <div class="buttons">
        <columns-config :columnsShown="columnsShown" />
        <export-button />
      </div>
    </div>
    <div>
      <grid :filteredData="filteredData" dataType="deals" :totalRows="totalRows">
        <template v-slot:headerMessage>{{ headerMessage }}</template>
      </grid>
    </div>
    <pagination :paginationCount="paginationCount" />
  </div>
</template>

<script>
import Deals from '../models/deals';
import SearchDeals from '../components/SearchDeals.vue';
import ExportButton from '../components/ExportButton.vue';
import ColumnsConfig from '../components/ColumnsConfig.vue';
import Grid from '../components/Grid.vue';
import Pagination from '../components/Pagination.vue';
import Utils, { LIMIT } from '../utils';

export default {
  components: {
    SearchDeals,
    ExportButton,
    ColumnsConfig,
    Grid,
    Pagination,
  },
  data() {
    return {
      deals: new Deals(),
      filteredData: [],
      paginationCount: 0,
      totalRows: 0,
    };
  },
  provide() {
    return { deals: this.deals, updateData: this.updateData };
  },
  mounted() {
    const response = this.deals.getDeals({ limit: LIMIT });
    this.updateData(response);
  },
  methods: {
    updateData({ data, paginationCount, total }) {
      this.filteredData = data;
      this.paginationCount = paginationCount;
      this.totalRows = total;
    },
  },
  computed: {
    columnsShown() {
      return Utils.getColumnKeys(this.filteredData).reduce((result, columnKey) => {
        result[columnKey] = true;
        return result;
      }, {});
    },
    headerMessage() {
      return `Showing ${this.totalRows} deals.`;
    },
  },
  watch: {
    $route(newRoute, oldRoute) {
      if (newRoute.query.offset !== oldRoute.query.offset) {
        const offset = parseInt(newRoute.query.offset) || 1;
        const newData = this.deals.getDeals({ offset: LIMIT * (offset - 1), limit: LIMIT });
        this.updateData(newData);
      }
    },
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
  display: flex;
  margin-left: auto;
}
</style>
