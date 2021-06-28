<template>
  <div @click.stop class="column-filter">
    <div class="column-name">{{ columnName }}</div>
    <div v-if="isColumnAlphabeticallySortable" class="alphabetical-sorting">
      <div @click="onSortAlphabetically('asc')">Sort A to Z</div>
      <div @click="onSortAlphabetically('desc')">Sort Z to A</div>
    </div>
    <div class="filters-options">
      <div class="filter-values">Filter {{ columnName }}</div>
      <div class="option" v-for="entry in uniqueValues" :key="entry.id">
        <input
          type="checkbox"
          :name="entry.value"
          :id="entry.id"
          :value="entry.value"
          v-model="entry.checked"
          @change="onChange"
        />
        <label :for="entry.id">{{ entry.name }}</label>
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
  inject: ['columnsTypes', 'model'],
  components: {
    BaseButton,
  },
  data() {
    return {
      uniqueValues: this.getUniqueValues(),
    };
  },
  computed: {
    isColumnAlphabeticallySortable() {
      return this.columnsTypes[this.columnKey] === String;
    },
  },
  methods: {
    getUniqueValues() {
      const uniqueValues = this.model.getUniqueValuesForColumn(this.columnKey, { all: 'true' });
      return uniqueValues.reduce((result, currentValue, currentIndex) => {
        const entry = {
          id: `${this.columnKey}-${currentIndex}`,
          value: currentValue,
          name: currentValue || '(blank)',
          checked: false,
        };
        result.push(entry);
        return result;
      }, []);
    },
    onSortAlphabetically(order) {
      const currentSort = Utils.getCurrentSort.bind(this)();
      const sort = encodeURIComponent(JSON.stringify([...currentSort, { key: this.columnKey, order }]));
      this.$router.push({ query: { ...this.$route.query, sort } });
      this.onClose();
    },
    onClearFilter() {
      const currentSort = Utils.getCurrentSort.bind(this)();
      this.$router.push({ query: { ...this.$route.query, sort: encodeURIComponent(JSON.stringify(currentSort)) } });
      this.onClose();
    },
    onChange() {
      const checkedValues = this.uniqueValues.filter((entry) => entry.checked).map((entry) => entry.value || null);
      const data = { key: this.columnKey, values: checkedValues };
      const encodedData = encodeURIComponent(JSON.stringify(data));
      this.$router.push({ query: { ...this.$route.query, uniqueValues: encodedData } });
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
  font-size: 1rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.filter-values {
  color: black;
  margin: 1rem 0;
}
</style>
