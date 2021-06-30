<template>
  <div class="documents">
    <div class="header">
      <search-bar>
        <template v-slot:title>
          <h2>Search Documents</h2>
        </template>
      </search-bar>
      <div class="buttons">
        <columns-config :columnsShown="columnsShown" />
        <export-button fileName="documents_data.csv" />
      </div>
    </div>

    <pagination :paginationCount="paginationCount" />

    <grid :filteredData="filteredData" :columnsShown="columnsShown">
      <template v-slot:headerMessage>{{ headerMessage }}</template>
    </grid>

    <pagination :paginationCount="paginationCount" />
  </div>
</template>

<script>
import Documents from '../models/documents';
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
      model: new Documents(),
      uniqueLocalStorageKey: 'Documents',
      filteredData: [],
      paginationCount: 0,
      totalRows: 0,
    };
  },
  provide() {
    return {
      model: this.model,
      columnsMap: Utils.DOCS_COLUMNS_MAP,
      columnsTypes: Utils.DOCS_COLUMNS_TYPES,
      persistedFields: {},
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
    onFilterChange(filterType, value) {
      Utils.handleFilterChange.bind(this)(filterType, value);
    },
  },
  computed: {
    columnsShown() {
      return Utils.getColumnsShown.bind(this)();
    },
    headerMessage() {
      return `Showing ${this.totalRows} documents.`;
    },
  },
};
</script>

<style lang="scss" scoped>
.documents {
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
