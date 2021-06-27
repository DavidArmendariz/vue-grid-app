<template>
  <div class="deals">
    <div class="header">
      <search-bar>
        <template v-slot:title>
          <h2>Search Deals</h2>
        </template>
      </search-bar>
      <div class="buttons">
        <columns-config :columnsShown="columnsShown" />
        <export-button :model="deals" fileName="deals_data.csv" />
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
import SearchBar from '../components/SearchBar.vue';
import ExportButton from '../components/ExportButton.vue';
import ColumnsConfig from '../components/ColumnsConfig.vue';
import Grid from '../components/Grid.vue';
import Pagination from '../components/Pagination.vue';
import Utils, { LIMIT } from '../utils';

export default {
  components: {
    SearchBar,
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
  mounted() {
    const queryParams = this.$route.query;
    const response = this.deals.getData({ ...queryParams, limit: LIMIT });
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
        const newData = this.deals.getData({
          offset: LIMIT * (offset - 1),
          limit: LIMIT,
          search: newRoute.query.search,
          columns: newRoute.query.columns || [],
        });
        this.updateData(newData);
      }

      if (newRoute.query.search !== oldRoute.query.search) {
        const newData = this.deals.getData({
          offset: 0,
          limit: LIMIT,
          search: newRoute.query.search,
          columns: newRoute.query.columns || [],
        });
        this.updateData(newData);
      }

      if (newRoute.query.columns !== oldRoute.query.columns) {
        const offset = parseInt(newRoute.query.offset) || 1;
        const newData = this.deals.getData({
          offset: LIMIT * (offset - 1),
          limit: LIMIT,
          search: newRoute.query.search,
          columns: newRoute.query.columns || [],
        });
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
