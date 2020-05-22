<template>
  <div>
    <product-detail :product="product" v-if="product" />
    <error v-if="errored" :status="status" />
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


interface ProductDetailModel {
  id: string;
  errored: boolean;
  status: number;
  product: Product | undefined;
}

export default Vue.extend({

  components: {
    NotFound,
    Error,
    ProductDetail
  },

  data() {
    return {
      id: '',
      status: 0,
      errored: false,
      product: undefined
    } as ProductDetailModel;
  },

  async mounted() {
    this.id = this.$route.params.id;

    const result: Response<Product> = await fetcher<Product>('GET', `/api/product/${this.id}`);
    this.status = result.status;
    if (this.status < 300) {
      this.product = result.data;
    } else {
      this.product = undefined;
    }
    this.errored = (result.status >= 500);

  }

});
</script>

<style scoped>

</style>
