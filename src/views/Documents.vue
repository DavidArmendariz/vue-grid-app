<template>
  <div>
    Documents
  </div>
</template>

<script>
import Documents from '../models/documents';

export default {
  provide: {
    deals: new Documents(),
  },
};
</script>
