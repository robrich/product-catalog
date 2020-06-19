import { shallowMount } from '@vue/test-utils';
import '../vuetify-setup';
import HelloWorld from '@/components/HelloWorld.vue'; // suite under test

describe('components/HelloWorld.vue', () => {
  it('renders', () => {

    // arrange
    const msg = /Welcome to Vuetify/;

    // act
    const wrapper = shallowMount(HelloWorld, {
      //propsData: { msg }
    });

    // assert
    expect(wrapper.text()).toMatch(msg);

  });
});
