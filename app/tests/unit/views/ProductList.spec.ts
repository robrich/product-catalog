import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { mocked } from 'ts-jest/utils';
import '../vuetify-setup';
import fetcher, { Response } from '@/services/fetcher';
import { Product } from '@/types/product';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';
import ProductList from '@/components/ProductList.vue';
import ProductListView from '@/views/ProductList.vue'; // suite under test

jest.mock('@/services/fetcher');

describe('views/ProductList.vue', () => {

  const deepMock = true;
  const mockedFetcher = mocked(fetcher, deepMock);

  function makeMockRoute(page: number) {
    return {
      params: {
        id: page
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
    const page = 0;
    const status = 200;
    const data = undefined;

    // act
    makeMockFetcher(status, data);
    const wrapper = shallowMount(ProductListView, {
      mocks: {
        $route: makeMockRoute(page)
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
    const page = 0;
    const status = 500;
    const data = 'some error text';

    // act
    makeMockFetcher(status, data);
    const wrapper = shallowMount(ProductListView, {
      mocks: {
        $route: makeMockRoute(page)
      }
    });
    await flushPromises();

    // assert
    expect(wrapper.findComponent(Error).exists()).toBe(true);
    
  });

  it('should show product on 200 with results', async () => {
    
    // arrange
    const page = 0;
    const status = 200;
    const data = [
      {
        productCode: 'abc'
      } as Product,
      {
        productCode: 'def'
      } as Product
    ];

    // act
    makeMockFetcher(status, data);
    const wrapper = shallowMount(ProductListView, {
      mocks: {
        $route: makeMockRoute(page)
      }
    });
    await flushPromises();

    // assert
    expect(wrapper.findComponent(ProductList).exists()).toBe(true);
    expect(wrapper.vm.$data.products).toBe(data);
    
  });

});
