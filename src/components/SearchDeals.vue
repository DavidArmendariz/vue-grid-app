<template>
  <div class="searchDeals">
    <h2>Search Deals</h2>
    <div class="searchBarContainer">
      <input type="text" placeholder="Search" v-model="filter" />
      <custom-icon class="searchIcon" icon="search" />
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
.searchDeals {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.searchBarContainer {
  display: flex;
  align-items: center;
}

.searchIcon {
  margin-left: 10px;
  cursor: pointer;
}
</style>
