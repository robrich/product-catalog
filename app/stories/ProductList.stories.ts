import ProductList from '../src/components/ProductList.vue';
import { withKnobs, number, text, boolean, object } from '@storybook/addon-knobs';
import { Product } from '../src/types/product';

export default {
  component: ProductList,
  title: 'components/ProductList',
  decorators: [ withKnobs ]
};

const defaultProducts: Product[] = [
  {
    id: 1,
    productCode: 'prod-1',
    name: 'Product 1',
    active: true,
    description: 'The default product description',
    properties: {
      has: 'many',
      pro: 'perties'
    }
  },
  {
    id: 2,
    productCode: 'prod-2',
    name: 'Product 2',
    active: true,
    description: 'The default product description',
    properties: {
      has: 'many',
      pro: 'perties'
    }
  }
];

export const unconfigured = () => ({
  components: { ProductList },
  template: '<ProductList :products="products"></ProductList>',
  props: {
    products: {
      default: () => defaultProducts
    }
  }
});

export const oneProduct = () => ({
  components: { ProductList },
  template: '<ProductList :products="products"></ProductList>',
  props: {
    products: {
      default: () => [ defaultProducts[0] ]
    }
  }
});

export const twoProducts = () => ({
  components: { ProductList },
  template: '<ProductList :products="products"></ProductList>',
  props: {
    products: {
      default: () => defaultProducts
    }
  }
});

export const noProducts = () => ({
  components: { ProductList },
  template: '<ProductList :products="products"></ProductList>',
  props: {
    products: {
      default: () => []
    }
  }
});
