<template>
  <div class="grid">
    <table>
      <thead>
        <tr>
          <th v-for="columnName in columnNames" :key="columnName">
            {{ columnName }}
          </th>
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
    columnNames() {
      if (this.filteredData.length) {
        return this.columnKeys.map((key) => COLUMNS_MAP[key]);
      }
      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
.grid {
  overflow-x: auto;
}

th {
  background-color: #e7ecf0;
  cursor: pointer;
  color: #5c99b7;
  padding: 1rem;
}
</style>
