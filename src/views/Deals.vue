<template>
  <div class="deals">
    <div>Deals</div>
    <div class="header">
      <search-deals />
      <div class="buttons">
        <columns-filter />
        <export-button />
      </div>
    </div>
  </div>
</template>

<script>
import Deals from '../models/deals';
import SearchDeals from '../components/SearchDeals.vue';
import ExportButton from '../components/ExportButton.vue';
import ColumnsFilter from '../components/ColumnsFilter.vue';

export default {
  components: {
    SearchDeals,
    ExportButton,
    ColumnsFilter,
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

.buttons {
  margin-left: auto;
}
</style>
