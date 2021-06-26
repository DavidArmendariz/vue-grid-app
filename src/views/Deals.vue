<template>
  <div class="deals">
    <div>Deals</div>
    <search-deals />
  </div>
</template>

<script>
import Deals from '@/models/deals';
import SearchDeals from '@/components/SearchDeals.vue';

export default {
  components: {
    SearchDeals,
  },
  provide: {
    deals: new Deals(),
  },
};
</script>

<style lang="scss" scoped>
.deals {
  padding: 1rem;
}
</style>
