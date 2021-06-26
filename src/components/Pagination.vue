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
import { MAX_PAGINATION } from '../utils';

const DOTS = '...';

export default {
  props: ['paginationCount'],
  data() {
    return {
      activePagination: 1,
    };
  },
  methods: {
    onClickLeftArrow() {
      this.activePagination -= 1;
    },
    onClickRightArrow() {
      this.activePagination += 1;
    },
    isActiveClass(n) {
      return n === this.activePagination ? 'active' : '';
    },
    onClick(n) {
      if (n === DOTS) {
        return;
      }
      this.activePagination = n;
    },
  },
  computed: {
    shouldShowLeftArrow() {
      if (this.paginationCount <= MAX_PAGINATION) {
        return false;
      }
      return this.activePagination > 1;
    },
    shouldShowRightArrow() {
      if (this.paginationCount <= MAX_PAGINATION) {
        return false;
      }
      return this.activePagination < this.paginationCount;
    },
    getPaginationNumbers() {
      if (this.paginationCount <= MAX_PAGINATION) {
        return Array.from(Array(MAX_PAGINATION), (_, index) => index + 1);
      }
      let i = 1;
      const leftNumbers = [];
      const rightNumbers = [];
      while (leftNumbers.length + rightNumbers.length + 1 < MAX_PAGINATION) {
        const left = this.activePagination - i;
        const right = this.activePagination + i;
        if (left >= 1) {
          leftNumbers.push(left);
        }
        if (right <= this.paginationCount) {
          rightNumbers.push(right);
        }
        i++;
      }
      leftNumbers.reverse();
      const paginationNumbers = [...leftNumbers, this.activePagination, ...rightNumbers];
      paginationNumbers[0] = 1;
      paginationNumbers[MAX_PAGINATION - 1] = this.paginationCount;
      if (paginationNumbers[1] - paginationNumbers[0] !== 1) {
        paginationNumbers.splice(1, 0, DOTS);
      }
      if (paginationNumbers[paginationNumbers.length - 1] - paginationNumbers[paginationNumbers.length - 2] !== 1) {
        paginationNumbers.splice(paginationNumbers.length - 1, 0, DOTS);
      }
      return paginationNumbers;
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
