<template>
  <base-button @click="onResetAll">
    <custom-icon icon="filter" />
    Reset filters
  </base-button>
</template>

<script>
import BaseButton from './BaseButton.vue';

export default {
  components: {
    BaseButton,
  },
  inject: ['onFilterChange', 'uniqueLocalStorageKey'],
  methods: {
    onResetAll() {
      this.onFilterChange('reset');
    },
  },
};
</script>
