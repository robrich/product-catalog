<template>
  <v-container data-cy="c-product-detail">
    
    <v-card outlined>
      <v-card-title>
        <h1>{{product.name}}</h1>
      </v-card-title>
      <v-card-text>
        <p>{{product.subtitle}}</p>
        <p>{{product.price}}</p>
        <ul class="feature-list" v-show="product.properties">
          <li v-for="[key, value] of Object.entries(product.properties || {})" :key="key"
            class="feature">
            {{key}}: {{value}}
          </li>
        </ul>
        <img class="image" :src="product.image" :alt="product.name" :title="product.name" />
        <div v-html="product.description"></div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Product } from '../types/product';

export default Vue.extend({

  props: {
    product: {
      type: Object as () => Product,
      required: true
    }
  }

});
</script>

<style scoped>
.feature-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}
.feature {
  margin-right: .5em;
  padding: 0 .5em;
  display: inline-block;
  border-radius: 1.5em;
  background-color: #AA00FF;
  color: white;
  line-height: 1.5em;
  font-size: 0.7em;
  font-weight: bold;
}
.image {
  margin: 20px auto;
  display: block;
  max-width: 100%;
}
</style>
