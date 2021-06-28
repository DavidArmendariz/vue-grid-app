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
        <export-button fileName="deals_data.csv" />
      </div>
    </div>
    <pagination :paginationCount="paginationCount" />
    <div>
      <grid :filteredData="filteredData">
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
import * as Utils from '../utils';

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
      model: new Deals(),
      filteredData: [],
      paginationCount: 0,
      totalRows: 0,
    };
  },
  provide() {
    return {
      model: this.model,
      columnsMap: Utils.DEALS_COLUMNS_MAP,
      columnsTypes: Utils.DEALS_COLUMNS_TYPES,
    };
  },
  mounted() {
    const response = this.model.getData(this.$route.query);
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
      return Utils.getColumnsShown.bind(this)();
    },
    headerMessage() {
      return `Showing ${this.totalRows} deals.`;
    },
  },
  watch: {
    $route(newRoute, oldRoute) {
      Utils.handleRouteChange.bind(this)(newRoute, oldRoute);
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
