import NotFound from '../src/components/NotFound.vue';

export default {
  component: NotFound,
  title: 'components/NotFound'
};

export const unconfigured = () => ({
  components: { NotFound },
  template: '<NotFound></NotFound>'
});
