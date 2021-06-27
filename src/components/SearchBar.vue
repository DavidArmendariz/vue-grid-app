<template>
  <div class="search-deals">
    <slot name="title"></slot>
    <div class="search-bar-container">
      <input type="text" placeholder="Search" v-model="filter" @keyup.enter="onSearch" />
      <custom-icon class="search-icon" icon="search" @click="onSearch" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: decodeURIComponent(this.$route.query.search || ''),
    };
  },
  methods: {
    onSearch() {
      const encodedSearchString = encodeURIComponent(this.filter);
      this.$router.push({ query: { search: encodedSearchString } });
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
