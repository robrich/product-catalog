<template>
  <div data-cy="c-error">
    <h1>{{status}}: Error</h1>
    <p>The system has failed. Try your request again or contact support.</p>
  </div>
</template>

<script type="ts">
import Vue from 'vue';

export default Vue.extend({

  props: {
    status: {
      type: Number,
      required: true
    }
  }

});
</script>
