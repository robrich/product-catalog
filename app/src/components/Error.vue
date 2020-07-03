<template>
  <div data-cy="c-error">
    <h1>{{status}}: Error</h1>
    <p><slot>The system has failed.</slot> <span v-show="showContactSupport">Try your request again or contact support.</span></p>
  </div>
</template>

<script type="ts">
import Vue from 'vue';

export default Vue.extend({

  props: {
    status: {
      type: Number,
      required: true
    },
    showContactSupport: {
      type: Boolean,
      default: true
    }
  }

});
</script>
