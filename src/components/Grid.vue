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
        <tr v-for="row in filteredData" :key="row.id">
          <td v-for="columnKey in columnKeys" :key="`${row.id}-${columnKey}`">
            {{ row[columnKey] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Utils, { COLUMNS_MAP } from '../utils';

export default {
  props: ['filteredData'],
  computed: {
    columnKeys() {
      if (this.filteredData.length) {
        return Utils.getColumnKeys(this.filteredData);
      }
      return [];
    },
    columns() {
      if (this.filteredData.length) {
        return this.columnKeys.map((key) => ({ key, name: COLUMNS_MAP[key] }));
      }
      return [];
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
</style>
