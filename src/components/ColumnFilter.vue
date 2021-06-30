<template>
  <div @click.stop class="column-filter">
    <div class="column-name">{{ columnName }}</div>
    <div v-if="isColumnAlphabeticallySortable" class="alphabetical-sorting">
      <div @click="onSort('asc')">Sort A to Z</div>
      <div @click="onSort('desc')">Sort Z to A</div>
    </div>
    <input class="filter-search-bar" type="text" :placeholder="placeholder" v-model="searchFilter" />
    <div class="filters-options">
      <div v-for="entry in uniqueValuesToRender" :key="entry.name">
        <input
          type="checkbox"
          :name="entry.name"
          :id="entry.name"
          :value="entry.value"
          v-model="entry.checked"
          @change="onChange"
        />
        <label :for="entry.name">{{ entry.name }}</label>
      </div>
    </div>
    <div class="buttons">
      <base-button @click.stop="onClearFilter">Clear Filter</base-button>
      <base-button @click.stop="onClose">Close</base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import * as Utils from '../utils';

export default {
  props: ['columnName', 'columnKey', 'onClose'],
  inject: ['columnsTypes', 'uniqueLocalStorageKey', 'onFilterChange'],
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
      return this.columnsTypes[this.columnKey] === String && this.uniqueValues.length > 1;
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
      this.onFilterChange('sort', sort);
      this.onClose();
    },
    onChange(event) {
      // If a column has all values as "(blank)", then removing it would get rid of the table
      if ((event.target._value === null || event.target._value === undefined) && this.uniqueValues.length === 1) {
        return;
      }

      const checkedValues = this.uniqueValues.filter((entry) => entry.checked).map((entry) => entry.value);
      const existingUniqueValuesFilter = Utils.getItemFromLocalStorage(
        `filters${this.uniqueLocalStorageKey}`,
        []
      ).filter((entry) => entry.key !== this.columnKey);
      existingUniqueValuesFilter.push({ key: this.columnKey, values: checkedValues });
      this.onFilterChange('uniqueValues', existingUniqueValuesFilter);
      Utils.setUniqueValuesToLocalStorage(this.uniqueValues);
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
  float: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.column-name {
  align-self: center;
  color: black;
}

.buttons {
  display: flex;
}

.alphabetical-sorting {
  div {
    padding: 1rem 0;
  }
}

.filters-options {
  text-align: left;
  max-height: 200px;
  width: 100%;
  overflow-y: auto;
}

.filter-search-bar {
  margin: 1rem 0;
}
</style>
