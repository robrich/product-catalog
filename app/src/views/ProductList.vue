<template>
  <div>
    <h1>Product list</h1>
    <product-list :products="products" v-if="products.length" />
    <error v-if="errored" :status="status" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import fetcher, { Response } from '../services/fetcher';
import { Product } from '../types/product';
import Error from '@/components/Error.vue';
import ProductList from '@/components/ProductList.vue';

interface ProductListModel {
  page: number;
  errored: boolean;
  status: number;
  products: Product[];
}

export default Vue.extend({

  components: {
    Error,
    ProductList
  },

  data() {
    return {
      page: 0,
      status: 0,
      errored: false,
      products: []
    } as ProductListModel;
  },

  async mounted() {
    this.page = parseInt(this.$route.params.page, 10);
    if (this.page < 0 || isNaN(this.page)) {
      this.page = 0;
    }

    const result: Response<Product[]> = await fetcher<Product[]>('GET', `/api/products/${this.page}`);
    this.status = result.status;
    if (this.status < 300 && result.data) {
      this.products = result.data;
    } else {
      this.products = [];
    }
    this.errored = (result.status >= 500);

  }

});
</script>

<style scoped>

</style>
