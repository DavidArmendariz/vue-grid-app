<template>
  <div class="pagination">
    <div v-if="shouldShowLeftArrow" @click="onClickLeftArrow">&laquo;</div>
    <div
      v-for="(item, index) in getPaginationNumbers"
      :key="`pagination-${index}`"
      :class="isActiveClass(item)"
      @click="onClick(item)"
    >
      {{ item }}
    </div>
    <div v-if="shouldShowRightArrow" @click="onClickRightArrow">&raquo;</div>
  </div>
</template>

<script>
import * as Utils from '../utils';

export default {
  props: ['paginationCount'],
  data() {
    return {
      activePagination: Utils.getItemFromLocalStorage('filters.offset', 1),
    };
  },
  inject: ['onFilterChange'],
  methods: {
    onClickLeftArrow() {
      this.activePagination -= 1;
      this.onChangePagination();
    },
    onClickRightArrow() {
      this.activePagination += 1;
      this.onChangePagination();
    },
    isActiveClass(n) {
      return n === this.activePagination ? 'active' : '';
    },
    onClick(n) {
      if (n === '...') {
        return;
      }
      this.activePagination = n;
      this.onChangePagination();
    },
    onChangePagination() {
      this.onFilterChange('offset', this.activePagination);
    },
  },
  computed: {
    shouldShowLeftArrow() {
      return this.activePagination > 1;
    },
    shouldShowRightArrow() {
      return this.activePagination < this.paginationCount;
    },
    getPaginationNumbers() {
      return Utils.getPaginationNumber.bind(this)(Utils.MAX_PAGINATION);
    },
  },
  watch: {
    paginationCount() {
      this.activePagination = Utils.getItemFromLocalStorage('filters.offset', 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 1rem;
  display: inline-block;
  div {
    padding: 8px 16px;
    float: left;
    cursor: pointer;
    &.active {
      background-color: #e7ecf0;
    }
  }
}
</style>
