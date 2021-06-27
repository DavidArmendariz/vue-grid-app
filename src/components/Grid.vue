<template>
  <div class="grid">
    <div v-if="showEmptyMessage">
      No data to display
    </div>
    <table v-else>
      <thead>
        <tr>
          <th class="header" v-for="column in columns" :key="column.key" @click="onHeaderClick(column.key)">
            {{ column.name }}
            <column-filter
              v-if="isColumnActive(column.key)"
              :columnName="column.name"
              :columnKey="column.key"
              :onClose="onCloseFilters"
            />
          </th>
        </tr>
        <tr>
          <th class="header-message" colspan="100%"><slot name="headerMessage" /></th>
        </tr>
      </thead>
      <tbody>
        <tr class="custom-row" v-for="row in filteredData" :key="row.id">
          <td v-for="columnKey in columnKeys" :key="`${row.id}-${columnKey}`">
            {{ processRow(columnKey, row[columnKey]) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Utils from '../utils';
import ColumnFilter from './ColumnFilter.vue';

export default {
  components: {
    ColumnFilter,
  },
  props: ['filteredData'],
  inject: ['columnsTypes', 'columnsMap'],
  data() {
    return {
      activeColumnKey: null,
    };
  },
  computed: {
    columnKeys() {
      if (this.filteredData.length) {
        return Utils.getColumnKeys(this.filteredData);
      }
      return [];
    },
    columns() {
      if (this.filteredData.length) {
        return this.columnKeys.map((key) => ({ key, name: this.columnsMap[key] }));
      }
      return [];
    },
    showEmptyMessage() {
      return this.filteredData.length === 0;
    },
  },
  methods: {
    onHeaderClick(columnKey) {
      if (this.isColumnActive(columnKey)) {
        return;
      }
      this.activeColumnKey = columnKey;
    },
    onCloseFilters() {
      this.activeColumnKey = null;
    },
    isColumnActive(columnKey) {
      return this.activeColumnKey === columnKey;
    },
    processRow(columnKey, row) {
      if (!row) {
        return '(blank)';
      }
      switch (this.columnsTypes[columnKey]) {
        case Array:
          return row.join(', ');
        case Date:
          return new Date(Date.parse(row)).toLocaleString();
        default:
          return row;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.grid {
  overflow-x: auto;
  display: flex;
  justify-content: center;
}

.header {
  background-color: #e7ecf0;
  cursor: pointer;
  color: #5c99b7;
  padding: 1rem;
  position: relative;
}

.header-message {
  background-color: #dddddd;
  text-align: left;
  color: black;
  font-weight: 100;
  padding: 1rem;
}

.custom-row {
  &:nth-child(even) {
    background-color: #f7f4f4;
  }
}

table {
  border-collapse: collapse;
}
</style>
