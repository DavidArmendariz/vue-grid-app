<template>
  <div class="table-wrapper">
    <div v-if="showEmptyMessage">
      No data to display
    </div>
    <table class="table" v-else>
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
  inject: ['columnsTypes', 'columnsMap', 'persistedFields', 'uniqueLocalStorageKey'],
  data() {
    return {
      activeColumnKey: null,
    };
  },
  computed: {
    columnKeys() {
      if (this.filteredData.length) {
        const columnsFromLocalStorage = Utils.getItemFromLocalStorage(
          `filters${this.uniqueLocalStorageKey}.columns`,
          []
        );
        return Utils.getColumnKeys(this.filteredData).filter((columnKey) =>
          Utils.shouldPersistedFieldBeIncluded.bind(this)(columnKey, columnsFromLocalStorage)
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
.table-wrapper {
  overflow-x: auto;
  display: flex;
  justify-content: center;
  height: 60vh;
  border-radius: 10px;
}

.table {
  border-collapse: collapse;
  table-layout: fixed;
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

.cell {
  height: 50px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .tooltip {
    visibility: hidden;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #555 transparent transparent transparent;
    }
  }

  &:hover {
    .tooltip {
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>
