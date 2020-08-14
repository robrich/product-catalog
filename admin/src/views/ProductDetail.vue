<template>
  <div id="product-detail">
    <Loading v-if="loading" />
    <div v-else>
      <product-detail :product="product" v-if="product" @save="save" />
      <error v-if="errored" :status="status" />
      <not-found v-if="!product && !errored" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Method } from 'axios';
import fetcher, { Response } from '../services/fetcher';
import { Product } from '../types/product';
import Loading from '@/components/Loading.vue';
import NotFound from '@/components/NotFound.vue';
import Error from '@/components/Error.vue';
import ProductDetail from '@/components/ProductDetail.vue';


interface ProductDetailModel {
  loading: boolean;
  saveError: boolean;
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
      saveError: false,
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

  },

  methods: {

    async save(product: Product) {

      this.loading = true;
      this.saveError = false;

      let method: Method;
      let url: string;
      if (product.id) {
        // update
        method = 'PUT';
        url = `/api/product/${product.id}`;
      } else {
        // insert
        method = 'POST';
        url = '/api/product';
      }
      const result: Response<Product> = await fetcher<Product>(method, url, product);

      if (result.ok) {
        return this.$router.push('/products');
      }

      // TODO: show error message
      this.saveError = true;
      this.loading = false;

    }

  }

});
</script>

<style scoped>

</style>
