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
      activePagination: parseInt(this.$route.query?.offset) || 1,
    };
  },
  methods: {
    onClickLeftArrow() {
      this.activePagination -= 1;
      this.addOffsetQueryParam();
    },
    onClickRightArrow() {
      this.activePagination += 1;
      this.addOffsetQueryParam();
    },
    isActiveClass(n) {
      return n === this.activePagination ? 'active' : '';
    },
    onClick(n) {
      if (n === '...') {
        return;
      }
      this.activePagination = n;
      this.addOffsetQueryParam();
    },
    addOffsetQueryParam() {
      const existingQueryParams = this.$route.query;
      this.$router.push({ query: { ...existingQueryParams, offset: this.activePagination } });
    },
  },
  watch: {
    $route(newRoute) {
      this.activePagination = parseInt(newRoute.query?.offset) || 1;
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
