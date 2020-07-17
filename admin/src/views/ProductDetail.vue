<template>
  <div id="product-detail">
    <Loading v-if="loading" />
    <div v-else>
      <product-detail :product="product" v-if="product" />
      <error v-if="errored" :status="status" />
      <not-found v-if="!product && !errored" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import fetcher, { Response } from '../services/fetcher';
import { Product } from '../types/product';
import Loading from '@/components/Loading.vue';
import NotFound from '@/components/NotFound.vue';
import Error from '@/components/Error.vue';
import ProductDetail from '@/components/ProductDetail.vue';


interface ProductDetailModel {
  loading: boolean;
  productCode: string;
  errored: boolean;
  status: number;
  product: Product | undefined;
}

export default Vue.extend({

  components: {
    Loading,
    NotFound,
    Error,
    ProductDetail
  },

  data() {
    return {
      loading: true,
      productCode: '',
      status: 0,
      errored: false,
      product: undefined
    } as ProductDetailModel;
  },

  async mounted() {
    this.loading = true;
    this.productCode = this.$route.params.id;

    const result: Response<Product> = await fetcher<Product>('GET', `/api/product/${this.productCode}`);
    this.status = result.status;
    if (this.status < 300) {
      this.product = result.data;
    } else {
      this.product = undefined;
    }
    this.errored = (result.status >= 500);
    this.loading = false;

  }

});
</script>

<style scoped>

</style>
