<template>
  <v-container>
    
    <v-card
      v-for="product in products"
      :key="product.id"
      class="mx-auto"
      max-width="400"
    >
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://placekitten.com/400/201"
      >
        <v-card-title>{{product.name}}</v-card-title>
      </v-img>

      <v-card-actions>
        <v-btn
          color="#AA00FF"
          text
          :to="`/product/${product.productCode}`"
        >
          Explore
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script type="ts">
import Vue from 'vue';
//import { Product } from '../types/product';

export default Vue.extend({

  props: {
    products: {
      type: Array,
      required: true
    }
  }

});
</script>

<style scoped>
</style>
