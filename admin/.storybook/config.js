import { configure, addDecorator } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';
import { withTemplate } from './addon-show-vue-markup';
import { withVuetify } from './addon-vuetify';

addDecorator(withKnobs);
addDecorator(withTemplate);
addDecorator(withVuetify);

configure(require.context('../stories', true, /.(js|ts)$/), module);
