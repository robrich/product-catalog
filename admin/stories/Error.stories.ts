import Error from '../src/components/Error.vue';
import { withKnobs, number, text, boolean } from '@storybook/addon-knobs';

export default {
  component: Error,
  title: 'components/Error',
  decorators: [ withKnobs ]
};

export const unconfigured = () => ({
  components: { Error },
  template: '<Error :status="500"></Error>'
});

export const configured = () => ({
  components: { Error },
  template: '<Error :status="status" :showContactSupport="showContactSupport">{{message}}</Error>',
  props: {
    status: {
      default: number('status', 500)
    },
    message: {
      default: text('message', 'The system has failed.')
    },
    showContactSupport: {
      default: boolean('showContactSupport', true)
    }
  }
});
