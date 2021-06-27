<template>
  <div class="search-deals">
    <slot name="title"></slot>
    <div class="search-bar-container">
      <input type="text" placeholder="Search" v-model="filter" />
      <custom-icon class="search-icon" icon="search" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: '',
    };
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
