<template>
  <div data-cy="c-custom-input">
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({

  props: {
    value: {
      type: String,
      required: true
    }
  }

});
</script>
