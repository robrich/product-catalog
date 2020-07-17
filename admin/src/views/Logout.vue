<template>
  <div id="logout">
    <h1>Logging out ...</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '../store';

export default Vue.extend({
  async mounted() {
    await Vue.nextTick();
    await store.dispatch('logout');
    this.$router.push('/');
  }
});
</script>
