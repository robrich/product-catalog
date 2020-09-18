import Properties from '../src/components/Properties.vue';
import { withKnobs, object, boolean } from '@storybook/addon-knobs';

export default {
  component: Properties,
  title: 'components/Properties',
  decorators: [ withKnobs ]
};


export const configured = () => ({
  components: { Properties },
  template: '<div><Properties v-model="model" :valid.sync="valid"></Properties><br />valid: {{valid}} model: {{model}}</div>',
  props: {
    model: {
      default: object('model', {has:'json'})
    },
    valid: {
      default: boolean('valid', true)
    }
  }
});
