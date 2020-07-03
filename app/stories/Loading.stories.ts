import Loading from '../src/components/Loading.vue';

export default {
  component: Loading,
  title: 'components/Loading'
};

export const unconfigured = () => ({
  components: { Loading },
  template: '<Loading></Loading>'
});
