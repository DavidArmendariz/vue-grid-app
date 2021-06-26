<template>
  <div>Deals</div>
</template>

<script>
import Deals from '../models/deals';

export default {
  provide: {
    deals: new Deals(),
  },
};
</script>
