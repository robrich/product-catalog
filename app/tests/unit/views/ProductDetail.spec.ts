import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { mocked } from 'ts-jest/utils';
import '../vuetify-setup';
import fetcher, { Response } from '@/services/fetcher';
import { Product } from '@/types/product';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';
import NotFound from '@/components/NotFound.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import ProductDetailView from '@/views/ProductDetail.vue'; // suite under test

jest.mock('@/services/fetcher');

describe('views/ProductDetail.vue', () => {

  const deepMock = true;
  const mockedFetcher = mocked(fetcher, deepMock);

  function makeMockRoute(productCode: string) {
    return {
      params: {
        id: productCode
      }
    };
  }

  function makeMockFetcher<TResponse>(status: number, data: TResponse | undefined) {
    mockedFetcher.mockImplementation(async (/*method: Method, url: string, data?: any*/) => {
      await Promise.resolve();
      return {
        status,
        data
      } as Response<TResponse>;
    });
  }

  function clearMocks() {
    jest.clearAllMocks();
    mockedFetcher.mockClear();
  }
  beforeEach(clearMocks);
  afterEach(clearMocks);

  it('shows loading until loaded', async () => {

    // arrange
    const productCode = 'unit-test-code';
    const status = 200;
    const data = undefined;

    // act
    makeMockFetcher(status, data);
    const wrapper = shallowMount(ProductDetailView, {
      mocks: {
        $route: makeMockRoute(productCode)
      }
    });

    // assert
    expect(wrapper.findComponent(Loading).exists()).toBe(true);

    // act
    await flushPromises();

    // assert
    expect(wrapper.findComponent(Loading).exists()).toBe(false);
    
  });

  it('should show error on 500', async () => {
    
    // arrange
    const productCode = 'unit-test-code';
    const status = 500;
    const data = 'some error text';

    // act
    makeMockFetcher(status, data);
    const wrapper = shallowMount(ProductDetailView, {
      mocks: {
        $route: makeMockRoute(productCode)
      }
    });
    await flushPromises();

    // assert
    expect(wrapper.findComponent(Error).exists()).toBe(true);
    
  });

  it('should show not found on 404', async () => {
    
    // arrange
    const productCode = 'unit-test-code';
    const status = 404;
    const data = undefined;

    // act
    makeMockFetcher(status, data);
    const wrapper = shallowMount(ProductDetailView, {
      mocks: {
        $route: makeMockRoute(productCode)
      }
    });
    await flushPromises();

    // assert
    expect(wrapper.findComponent(NotFound).exists()).toBe(true);
    
  });

  it('should show product on 200 with results', async () => {
    
    // arrange
    const productCode = 'unit-test-code';
    const status = 200;
    const data = {
      productCode
    } as Product;

    // act
    makeMockFetcher(status, data);
    const wrapper = shallowMount(ProductDetailView, {
      mocks: {
        $route: makeMockRoute(productCode)
      }
    });
    await flushPromises();

    // assert
    expect(wrapper.findComponent(ProductDetail).exists()).toBe(true);
    expect(wrapper.vm.$data.product).toBe(data);
    
  });

});
