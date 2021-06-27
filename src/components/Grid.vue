<template>
  <div class="grid">
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.name }}
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

export default {
  props: ['filteredData', 'columnsMap', 'columnsTypes'],
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
  },
  methods: {
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

th {
  background-color: #e7ecf0;
  cursor: pointer;
  color: #5c99b7;
  padding: 1rem;
}

.header-message {
  background-color: #dddddd;
  text-align: left;
  color: black;
  font-weight: 100;
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
