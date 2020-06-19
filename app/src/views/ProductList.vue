<template>
  <div>
    <h1>Product list</h1>
    <Loading v-if="loading" />
    <div v-else>
      <product-list :products="products" v-if="products.length" />
      <error v-if="errored" :status="status" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import fetcher, { Response } from '../services/fetcher';
import { Product } from '../types/product';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';
import ProductList from '@/components/ProductList.vue';

interface ProductListModel {
  loading: boolean;
  page: number;
  errored: boolean;
  status: number;
  products: Product[];
}

export default Vue.extend({

  components: {
    Loading,
    Error,
    ProductList
  },

  data() {
    return {
      loading: true,
      page: 0,
      status: 0,
      errored: false,
      products: []
    } as ProductListModel;
  },

  async mounted() {
    this.loading = true;
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
    this.loading = false;

  }

});
</script>

<style scoped>

</style>
