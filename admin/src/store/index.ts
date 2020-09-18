import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';
import { VuexData, LoginData } from '../types/store';
import { UserRole } from '../types/user';

Vue.use(Vuex);

const defaultState: VuexData = {
  jwt: undefined,
  username: undefined,
  roles: []
};

export default new Vuex.Store({
  state: defaultState,
  actions: {

    login(context: ActionContext<VuexData, VuexData>, args: LoginData) {
      const { jwt, username, roles } = args;
      if (jwt) {
        context.commit('jwt', jwt);
        context.commit('username', username);
        context.commit('roles', roles || []);
      } else {
        context.commit('jwt', undefined);
        context.commit('username', undefined);
        context.commit('roles', []);
      }      
    },

    logout(context: ActionContext<VuexData, VuexData>) {
      context.commit('jwt', undefined);
      context.commit('username', undefined);
      context.commit('roles', []);
    }

  },
  mutations: {

    jwt: (state: VuexData, jwt: string | undefined) => {
      state.jwt = jwt;
    },

    username: (state: VuexData, username: string | undefined) => {
      state.username = username;
    },

    roles: (state: VuexData, roles: UserRole[] | undefined) => {
      state.roles = roles || [];
    }

  },
  getters: {

    isAuthenticated: (state: VuexData) => !!state.jwt,

    isUserEditor: (state: VuexData) => !!state.roles.find(r => r === UserRole.UserEditor)

  },
  modules: {
  }
});
