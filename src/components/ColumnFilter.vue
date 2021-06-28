<template>
  <div class="column-filter">
    <div class="column-name">{{ columnName }}</div>
    <div v-if="isColumnAlphabeticallySortable" class="alphabetical-sorting">
      <div @click="onSortAlphabetically('asc')">Sort A to Z</div>
      <div @click="onSortAlphabetically('desc')">Sort Z to A</div>
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
  inject: ['columnsTypes'],
  components: {
    BaseButton,
  },
  computed: {
    isColumnAlphabeticallySortable() {
      return this.columnsTypes[this.columnKey] === String;
    },
  },
  methods: {
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
</style>
