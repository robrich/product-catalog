import { withKnobs, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import StoryRouter from 'storybook-vue-router';
import UserList from '../src/components/UserList.vue';
import { User, UserRole } from '../src/types/user';
import { UserModel } from '../src/types/user-model';


export default {
  component: UserList,
  title: 'components/UserList',
  decorators: [
    withKnobs,
    StoryRouter()
  ],
  argTypes: {
    onUserUpdated: { action: 'userUpdated' }
  }
};

const sampleUserList: UserModel[] = [
  {
    username: 'user1',
    catalogReadOnly: false,
    catalogEditor: true,
    userEditor: false
  },
  {
    username: 'admin',
    catalogReadOnly: true,
    catalogEditor: true,
    userEditor: true
  }
];

export const configured = () => ({
  components: { UserList },
  template: '<UserList v-model="model" @userChanged="userChanged"></UserList>',
  props: {
    model: {
      default: object('model', sampleUserList)
    }
  },
  methods: {
    userChanged: action('userChanged')
  }
});
