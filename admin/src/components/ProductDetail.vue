<template>
  <v-container data-cy="c-product-detail">
    <v-card outlined>
      <v-card-title>
        <h1>{{product.productCode}}</h1>
        <p>{{product.id}}</p>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="formValid"
          lazy-validation
          @submit="save"
        >
          <v-text-field
            v-model="product.productCode"
            :rules="productCodeRules"
            label="Product Code"
            required
          ></v-text-field>

          <v-text-field
            v-model="product.name"
            :counter="100"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="product.description"
            :counter="512"
            :rules="descriptionRules"
            label="Description"
            required
          ></v-text-field>

          <p>// TODO: properties</p>

          <v-checkbox
            v-model="product.active"
            label="Active"
          ></v-checkbox>

          <v-btn
            :disabled="!formValid"
            color="primary"
            class="mr-4"
            type="submit"
          >
            Save
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Product } from '../types/product';

export default Vue.extend({

  data: () => ({
    formValid: true,
    productCodeRules: [
      (v: string) => !!v || 'Product Code is required',
      (v: string) => /[a-zA-Z0-9]+/.test(v) || 'Product Code must be only letters and numbers',
    ],
    nameRules: [
      (v: string) => !!v || 'Name is required',
      (v: string) => (v && v.length <= 100) || 'Name must be 100 characters or less'
    ],
    descriptionRules: [
      (v: string) => (v && v.length <= 512) || 'Description must be 512 characters or less'
    ]
  }),

  props: {
    product: {
      type: Object as () => Product,
      required: true
    }
  },

  methods: {

    async save() {
      if (!this.formValid) {
        return;
      }

      // TODO: save

    }

  }

});
</script>

<style scoped>
</style>
