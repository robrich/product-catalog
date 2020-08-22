import { shallowMount } from '@vue/test-utils';
import '../vuetify-setup';
import ProductDetail from '@/components/ProductDetail.vue'; // suite under test
import { Product } from '@/types/product';

describe('components/ProductDetail.vue', () => {
  it('renders', () => {

    // arrange
    const name = 'unit-test-product';
    const product: Product = {
      name,
      // satisfy interface, not related to test:
      id: 1,
      active: true,
      subtitle: 'test',
      price: 12.34,
      image: 'https://placekitten.com/100/100',
      description: '<p>test</p>',
      productCode: 'test-code',
      properties: {any:'values'}
    };

    // act
    const wrapper = shallowMount(ProductDetail, {
      propsData: { product }
    });

    // assert
    expect(wrapper.text()).toContain(name);
    
  });

});
