<template>
  <div id="home">
    <Login />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Login from '@/components/Login.vue';

export default Vue.extend({
  name: 'Home',
  components: {
    Login
  }
});
</script>

<style scoped>
#home {
  height: 100%;
}
</style>
