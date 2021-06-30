<template>
  <div @click.stop class="column-filter">
    <div class="column-name">{{ columnName }}</div>
    <div v-if="isColumnAlphabeticallySortable" class="sorting">
      <div @click="onSort('asc')">Sort A to Z</div>
      <div @click="onSort('desc')">Sort Z to A</div>
    </div>
    <div v-if="isColumnSortable" class="sorting">
      <div @click="onSort('asc')">Sort ascending</div>
      <div @click="onSort('desc')">Sort descending</div>
    </div>
    <input class="filter-search-bar" type="text" :placeholder="placeholder" v-model="searchFilter" />
    <div class="filters-options" ref="inputs">
      <div v-for="entry in uniqueValuesToRender" :key="entry.name">
        <input
          type="checkbox"
          :name="entry.name"
          :id="entry.name"
          :value="entry.value"
          v-model="entry.checked"
          @change="onChange"
          :disabled="checkDisable(entry.checked)"
        />
        <label :for="entry.name">{{ entry.name }}</label>
      </div>
    </div>
    <div class="buttons">
      <base-button class="button clear-filter" @click.stop="onClearFilter">Clear Filter</base-button>
      <base-button class="button" @click.stop="onClose">Close</base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import * as Utils from '../utils';

export default {
  props: ['columnName', 'columnKey', 'onClose'],
  inject: ['columnsTypes', 'uniqueLocalStorageKey', 'onFilterChange', 'model'],
  components: {
    BaseButton,
  },
  data() {
    return {
      uniqueValues: [],
      searchFilter: '',
    };
  },
  mounted() {
    this.uniqueValues = this.getUniqueValues();
  },
  computed: {
    isColumnAlphabeticallySortable() {
      return [String, Array].includes(this.columnsTypes[this.columnKey]) && this.uniqueValues.length > 1;
    },
    isColumnSortable() {
      return [Number, Date].includes(this.columnsTypes[this.columnKey]) && this.uniqueValues.length > 1;
    },
    placeholder() {
      return `Filter ${this.columnName}`;
    },
    uniqueValuesToRender() {
      return this.uniqueValues.filter((value) => {
        const name = value.name.toLowerCase();
        const searchFilter = this.searchFilter;

        if (searchFilter) {
          return name.includes(searchFilter);
        }

        return true;
      });
    },
  },
  methods: {
    getUniqueValues() {
      return Utils.getUniqueValues.bind(this)();
    },
    onSort(order) {
      const sort = Utils.getItemFromLocalStorage(`filters${this.uniqueLocalStorageKey}.sort`, []).filter(
        (entry) => entry.key !== this.columnKey
      );
      sort.push({ key: this.columnKey, order });
      this.onFilterChange('sort', sort);
      this.onClose();
    },
    onClearFilter() {
      const sort = Utils.getItemFromLocalStorage(`filters${this.uniqueLocalStorageKey}.sort`, []).filter(
        (entry) => entry.key !== this.columnKey
      );
      const uniqueValues = Utils.getUniqueValues.bind(this)();
      this.uniqueValues = uniqueValues.map((entry) => ({ ...entry, checked: true }));
      Utils.deleteUniqueValuesFromLocalStorage.bind(this)();
      this.onFilterChange('sort', sort);
      this.onFilterChange('uniqueValues', []);
      this.onClose();
    },
    onChange() {
      const checkedValues = this.uniqueValues.filter((entry) => entry.checked).map((entry) => entry.value);
      const newUniqueValuesFilter = Utils.getItemFromLocalStorage(
        `filters${this.uniqueLocalStorageKey}.uniqueValues`,
        []
      ).filter((entry) => entry.key !== this.columnKey);
      newUniqueValuesFilter.push({ key: this.columnKey, values: checkedValues });
      this.onFilterChange('uniqueValues', newUniqueValuesFilter);
      Utils.setUniqueValuesToLocalStorage.bind(this)();
    },
    checkDisable(checked) {
      const checkedNumber = this.$refs.inputs.querySelectorAll('input:checked').length;
      return (checkedNumber === 1 && checked && this.uniqueValues.length > 1) || this.uniqueValues.length === 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.column-filter {
  background-color: white;
  border: 1px solid black;
  position: absolute;
  padding: 1rem;
  z-index: 1;
  top: 100%;
  float: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.column-name {
  align-self: center;
  color: black;
  font-size: 0.9rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.sorting div {
  text-align: left;
  margin: 8px 0;
  font-size: 0.85rem;
}

.filters-options {
  text-align: left;
  max-height: 200px;
  width: 100%;
  overflow-y: auto;
  font-size: 0.85rem;
  label,
  input {
    vertical-align: middle;
  }
}

.filter-search-bar {
  margin: 1rem 0;
}

.button {
  padding: 4px;
  color: black;
  margin: 10px 0;
  background-color: white;
  border: 1px solid black;
  &.clear-filter {
    background-color: #f0ad4e;
    color: white;
    border: none;
  }
}
</style>
