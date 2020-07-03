<template>
  <v-card
    class="mx-auto loading"
    data-cy="c-loading"
  >
    <v-card-title>
      <v-progress-circular
        indeterminate
        color="#c9c9c9"
      ></v-progress-circular>
      &nbsp;
      <span class="title font-weight-light">Loading ...</span>
    </v-card-title>
  </v-card>
</template>

<script type="ts">
import Vue from 'vue';

export default Vue.extend({
});
</script>

<style scoped>
.loading {
  margin: 200px auto;
  width: 175px;
}
</style>
