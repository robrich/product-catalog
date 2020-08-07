import CustomInput from '../src/components/CustomInput.vue';
import { withKnobs, number, text, boolean } from '@storybook/addon-knobs';

export default {
  component: CustomInput,
  title: 'components/CustomInput',
  decorators: [ withKnobs ]
};

export const configured = () => ({
  components: { CustomInput },
  template: '<div><CustomInput v-model="data"></CustomInput><br />{{data}}</div>',
  props: {
    data: {
      default: text('data', 'Type things here')
    }
  }
});
