<template>
  <div class="search-deals">
    <slot name="title"></slot>
    <div class="search-bar-container">
      <input type="text" placeholder="Search" v-model.trim="filter" @keyup.enter="onSearch" />
      <custom-icon class="search-icon" icon="search" @click="onSearch" />
    </div>
  </div>
</template>

<script>
import * as Utils from '../utils';

export default {
  inject: ['onFilterChange', 'uniqueLocalStorageKey'],
  data() {
    return {
      filter: Utils.getItemFromLocalStorage(`filters${this.uniqueLocalStorageKey}.search`, ''),
      debounce: null,
    };
  },
  watch: {
    filter() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.onFilterChange('search', this.filter);
      }, 500);
    },
  },
  methods: {
    onSearch() {
      this.onFilterChange('search', this.filter);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-deals {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.search-bar-container {
  display: flex;
  align-items: center;
}

.search-icon {
  margin-left: 10px;
  cursor: pointer;
}
</style>
