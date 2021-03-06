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
          @submit.prevent="save"
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
            v-model="product.subtitle"
            :counter="512"
            :rules="subtitleRules"
            label="Subtitle"
          ></v-text-field>

          <v-text-field
            v-model="product.price"
            :rules="priceRules"
            label="Price"
            type="number"
          ></v-text-field>

          <v-text-field
            v-model="product.image"
            :rules="imageRules"
            label="Product Image"
          >
            <template v-slot:append-outer>
              <v-card>
                <img :src="product.image" class="product-image" />
              </v-card>
            </template>
          </v-text-field>

          <quill-editor v-model="product.description" />

          <Properties v-model="product.properties" :valid.sync="propertiesValid"></Properties>

          <v-checkbox
            v-model="product.active"
            label="Active"
          ></v-checkbox>

          <v-btn
            :disabled="!formValid || !propertiesValid"
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
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import { Product } from '../types/product';
import Properties from './Properties.vue';

export default Vue.extend({

  components: {
    Properties,
    quillEditor
  },

  data: () => ({
    formValid: true,
    propertiesValid: true,
    productCodeRules: [
      (v: string) => !!v || 'Product Code is required',
      (v: string) => /[a-zA-Z0-9]+/.test(v) || 'Product Code must be only letters and numbers',
    ],
    nameRules: [
      (v: string) => !!v || 'Name is required',
      (v: string) => (v && v.length <= 100) || 'Name must be 100 characters or less'
    ],
    subtitleRules: [
      (v: string) => (v && v.length <= 512) || 'Subtitle must be 512 characters or less'
    ],
    priceRules: [
      (v: string) => !!v || 'Price is required',
      (v: string) => (v && !isNaN(parseFloat(v))) || 'Price must be a number',
      (v: string) => (v && +v >= 0) || 'Price must be positive'
    ],
    imageRules: [
      (v: string) => (v && v.indexOf('https://') === 0) || 'Image must be a url',
      (v: string) => (v && v.length <= 512) || 'Image must be 512 characters or less'
    ]
  }),

  props: {
    product: {
      type: Object as () => Product,
      required: true
    }
  },

  methods: {

    save() {
      if (!this.formValid || !this.propertiesValid) {
        return;
      }
      this.$emit('save', this.product);
    }

  }

});
</script>

<style scoped>
.product-image {
  max-height: 45px;
  display: block;
}
</style>
