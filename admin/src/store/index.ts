import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';
import { VuexData, LoginData } from '../types/store';

Vue.use(Vuex);

const defaultState: VuexData = {
  jwt: undefined,
  email: undefined
};

export default new Vuex.Store({
  state: defaultState,
  actions: {

    login(context: ActionContext<VuexData, VuexData>, args: LoginData) {
      const { jwt, email } = args;
      if (jwt) {
        context.commit('jwt', jwt);
        context.commit('email', email);
      } else {
        context.commit('jwt', undefined);
        context.commit('email', undefined);
      }      
    },

    logout(context: ActionContext<VuexData, VuexData>) {
      context.commit('jwt', undefined);
      context.commit('email', undefined);
    }

  },
  mutations: {

    jwt: (state: VuexData, jwt: string | undefined) => {
      state.jwt = jwt;
    },

    email: (state: VuexData, email: string | undefined) => {
      state.email = email;
    }

  },
  getters: {

    isAuthenticated: (state: VuexData) => !!state.jwt

  },
  modules: {
  }
});
