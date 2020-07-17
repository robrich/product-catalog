<template>
  <v-container data-cy="c-product-list">
    <v-card
      data-cy="product-list-card"
    >
      <v-data-table
        :headers="headers"
        :items="products"
        class="elevation-1"
        @click:row="navigate"
      >
        <template v-slot:item.productCode="{ item }">
          <router-link :to="`/product/${item.productCode}`">
            {{ item.productCode }}
          </router-link>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Product } from '../types/product';

export default Vue.extend({

  data: () => ({
    headers: [
      { text: 'Product Code', value: 'productCode' },
      { text: 'Name', value: 'name' },
      { text: 'Active', value: 'active' }
    ]
  }),

  props: {
    products: {
      type: Array as () => Product[],
      required: true
    }
  },

  methods: {

    navigate(item: Product) {
      this.$router.push(`/product/${item.productCode}`);
    }

  }

});
</script>

<style scoped>
</style>
