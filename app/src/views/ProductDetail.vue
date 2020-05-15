<template>
  <div>
    <product-detail :product="product" v-if="product" />
    <error v-if="errored" />
    <not-found v-if="!product && !errored" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import fetcher, { Response } from '../services/fetcher';
import { Product } from '../types/product';
import NotFound from '@/components/NotFound.vue';
import Error from '@/components/Error.vue';
import ProductDetail from '@/components/ProductDetail.vue';


export default Vue.extend({

  components: {
    NotFound,
    Error,
    ProductDetail
  },

  data() {
    const product: Product | undefined = undefined;
    return {
      id: 0,
      errored: false,
      product
    };
  },

  async mounted() {
    this.id = this.$route.params.id;

    const result: Response<Product> = await fetcher<Product>('GET', `/api/product/${this.id}`);
    this.product = result.data;
    this.errored = (result.status >= 500);

  }

});
</script>

<style scoped>

</style>
