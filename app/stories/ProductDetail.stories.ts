import ProductDetail from '../src/components/ProductDetail.vue';
import { withKnobs, number, text, boolean, object } from '@storybook/addon-knobs';
import { Product } from '../src/types/product';

export default {
  component: ProductDetail,
  title: 'components/ProductDetail',
  decorators: [ withKnobs ]
};

const defaultProduct: Product = {
  id: 123,
  productCode: 'default',
  name: 'Default Product',
  active: true,
  desription: 'The default product description',
  properties: {
    has: 'many',
    pro: 'perties'
  }
};

export const unconfigured = () => ({
  components: { ProductDetail },
  template: '<ProductDetail :product="product"></ProductDetail>',
  props: {
    product: {
      default: () => defaultProduct
    }
  }
});

export const configured = () => ({
  components: { ProductDetail },
  template: '<ProductDetail :product="{id, productCode, name, active, description, properties}"></ProductDetail>',
  props: {
    id: {
      default: number('id', 123)
    },
    productCode: {
      default: text('productCode', 'default')
    },
    name: {
      default: text('name', 'Default Product')
    },
    active: {
      default: boolean('active', true)
    },
    desription: {
      default: text('description', 'The default product description')
    },
    properties: {
      default: object('properties', {has:'json'})
    }
  }
});

export const oneProperty = () => ({
  components: { ProductDetail },
  template: '<ProductDetail :product="{id, productCode, name, active, description, properties}"></ProductDetail>',
  props: {
    id: {
      default: number('id', 123)
    },
    productCode: {
      default: text('productCode', 'default')
    },
    name: {
      default: text('name', 'Default Product')
    },
    active: {
      default: boolean('active', true)
    },
    desription: {
      default: text('description', 'The default product description')
    },
    properties: {
      default: object('properties', {has:'json'})
    }
  }
});

export const twoProperties = () => ({
  components: { ProductDetail },
  template: '<ProductDetail :product="{id, productCode, name, active, description, properties}"></ProductDetail>',
  props: {
    id: {
      default: number('id', 123)
    },
    productCode: {
      default: text('productCode', 'default')
    },
    name: {
      default: text('name', 'Default Product')
    },
    active: {
      default: boolean('active', true)
    },
    desription: {
      default: text('description', 'The default product description')
    },
    properties: {
      default: object('properties', {has:'many', pro: 'perties'})
    }
  }
});

export const noProperties = () => ({
  components: { ProductDetail },
  template: '<ProductDetail :product="{id, productCode, name, active, description, properties}"></ProductDetail>',
  props: {
    id: {
      default: number('id', 123)
    },
    productCode: {
      default: text('productCode', 'default')
    },
    name: {
      default: text('name', 'Default Product')
    },
    active: {
      default: boolean('active', true)
    },
    desription: {
      default: text('description', 'The default product description')
    },
    properties: {
      default: object('properties', null)
    }
  }
});
