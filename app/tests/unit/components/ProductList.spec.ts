import { shallowMount } from '@vue/test-utils';
import '../vuetify-setup';
import ProductList from '@/components/ProductList.vue'; // suite under test
import { Product } from '@/types/product';

describe('components/ProductList.vue', () => {
  it('renders', () => {

    // arrange
    const name1 = 'unit-test-product-1';
    const name2 = 'unit-test-product-2';
    const products: Product[] = [
      {
        name: name1,
        // satisfy interface, not related to test:
        id: 1,
        active: true,
        subtitle: 'test',
        price: 12.34,
        image: 'https://placekitten.com/100/100',
        description: '<p>test</p>',
        productCode: 'test-code-1',
        properties: {any:'values'}
      },
      {
        name: name2,
        // satisfy interface, not related to test:
        id: 2,
        active: true,
        subtitle: 'test',
        price: 12.34,
        image: 'https://placekitten.com/100/100',
        description: '<p>test</p>',
        productCode: 'test-code-2',
        properties: {any:'values'}
      }
    ];

    // act
    const wrapper = shallowMount(ProductList, {
      propsData: { products }
    });

    // assert
    const html = wrapper.text();
    expect(html).toContain(name1);
    expect(html).toContain(name2);
    
  });

});
