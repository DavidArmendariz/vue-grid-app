<template>
  <div class="grid">
    <div v-if="showEmptyMessage">
      No data to display
    </div>
    <table v-else>
      <thead>
        <tr>
          <th class="header"></th>
          <th class="header" v-for="column in columns" :key="column.key" @click="onHeaderClick(column.key)">
            {{ column.name }}
            <column-filter
              v-if="isColumnActive(column.key)"
              :columnName="column.name"
              :columnKey="column.key"
              :onClose="onCloseColumnFilter"
              :filteredData="filteredData"
            />
          </th>
          <th class="header" v-if="hasLinkSlot"></th>
        </tr>
        <tr>
          <th class="header-message" colspan="100%"><slot name="headerMessage" /></th>
        </tr>
      </thead>
      <tbody>
        <tr class="custom-row" v-for="row in filteredData" :key="row.id">
          <td>
            <input type="checkbox" name="" id="" />
          </td>
          <td v-for="columnKey in columnKeys" :key="`${row.id}-${columnKey}`">
            <div class="cell">
              {{ processRow(columnKey, row[columnKey]) }}
              <span class="tooltip" v-if="shouldShowTooltip(columnKey, row[columnKey])">{{
                processRow(columnKey, row[columnKey], false)
              }}</span>
            </div>
          </td>
          <slot name="link" :row="row"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as Utils from '../utils';
import ColumnFilter from './ColumnFilter.vue';

export default {
  components: {
    ColumnFilter,
  },
  props: ['filteredData', 'columnsShown'],
  inject: ['columnsTypes', 'columnsMap', 'persistedFields'],
  data() {
    return {
      activeColumnKey: null,
    };
  },
  computed: {
    columnKeys() {
      if (this.filteredData.length) {
        const columnsFromQueryParams = Utils.getColumnsFromQueryParams.bind(this)();
        return Utils.getColumnKeys(this.filteredData).filter((columnKey) =>
          Utils.shouldPersistedFieldBeIncluded.bind(this)(columnKey, columnsFromQueryParams)
        );
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
    hasLinkSlot() {
      return !!this.$slots.link;
    },
  },
  methods: {
    onHeaderClick(columnKey) {
      if (this.isColumnActive(columnKey)) {
        this.onCloseColumnFilter();
        return;
      }
      this.activeColumnKey = columnKey;
    },
    onCloseColumnFilter() {
      this.activeColumnKey = null;
    },
    isColumnActive(columnKey) {
      return this.activeColumnKey === columnKey;
    },
    processRow(columnKey, row, ellipsis = true) {
      return Utils.processRow.bind(this)(columnKey, row, ellipsis);
    },
    shouldShowTooltip(columnKey, row) {
      return this.processRow(columnKey, row) !== this.processRow(columnKey, row, false);
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
  &:nth-last-child(-n + 2) > div {
    right: 0;
  }
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
  table-layout: fixed;
}

.cell {
  height: 50px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    span.tooltip {
      display: block;
    }
  }
}

.tooltip {
  display: none;
  position: absolute;
  z-index: 1;
  background-color: white;
  border: 1px solid #5c99b7;
  border-radius: 1rem;
  padding: 5px;
  color: #5c99b7;
  top: -5px;
  left: 105%;
  overflow-wrap: break-word;
}
</style>
