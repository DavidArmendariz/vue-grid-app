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

    <grid :filteredData="filteredData" :columnsShown="columnsShown">
      <template v-slot:headerMessage>{{ headerMessage }}</template>
      <template v-slot:link="slotLinkProps">
        <td>
          <div class="view-documents">
            <router-link :to="getLink(slotLinkProps.row)">View Documents</router-link>
          </div>
        </td>
      </template>
    </grid>

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
      uniqueLocalStorageKey: 'Deals',
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
      persistedFields: {
        dealId: true,
      },
      onFilterChange: this.onFilterChange,
      uniqueLocalStorageKey: this.uniqueLocalStorageKey,
    };
  },
  mounted() {
    const filters = Utils.getItemFromLocalStorage(`filters${this.uniqueLocalStorageKey}`, {});
    const response = Utils.getDataFromModel.bind(this)(filters);
    this.updateData(response);
  },
  methods: {
    updateData({ data, paginationCount, total }) {
      this.filteredData = data;
      this.paginationCount = paginationCount;
      this.totalRows = total;
    },
    getLink(row) {
      return {
        name: 'Documents',
        query: {
          dealId: row.dealId,
        },
      };
    },
    onFilterChange(filterType, value) {
      Utils.handleFilterChange.bind(this)(filterType, value);
    },
  },
  computed: {
    columnsShown() {
      return Utils.getColumnsShown.bind(this)();
    },
    headerMessage() {
      return `Showing ${this.totalRows} deal${this.totalRows === 1 ? '' : 's'}.`;
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

.view-documents {
  height: 50px;
  padding: 8px;
  display: flex;
  align-items: center;
  a {
    text-decoration: none;
  }
}
</style>
