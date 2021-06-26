<template>
  <div class="deals">
    <div>Deals</div>
    <div class="header">
      <search-deals />
      <export-button class="export-button" />
    </div>
  </div>
</template>

<script>
import Deals from '@/models/deals';
import SearchDeals from '@/components/SearchDeals.vue';
import ExportButton from '@/components/ExportButton.vue';

export default {
  components: {
    SearchDeals,
    ExportButton,
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

.header {
  display: flex;
  align-items: center;
}

.export-button {
  margin-left: auto;
}
</style>
