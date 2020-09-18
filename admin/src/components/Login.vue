<template>
  <div id="c-login">
    <v-card
      class="mx-auto"
      outlined
      id="login-card"
    >
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="200px"
      ></v-img>
      <v-card-title>
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            label="Username"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            required
            :append-icon="passwordShow ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click:append="() => (passwordShow = !passwordShow)"
            :type="passwordShow ? 'text' : 'password'"
          ></v-text-field>

          <v-btn
            :disabled="!valid && !loading"
            block
            type="submit"
          >
            Login
          </v-btn>
        </v-form>

        <v-alert v-if="loginFail" type="error">
          Invalid username / password
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import fetcher from '../services/fetcher';
import store from '../store';
import { User, usernameRegex } from '../types/user';

export type LoginResponse = {
  token: string | undefined;
  user: User | undefined;
};

export default Vue.extend({

  data: () => ({
    loginFail: false,
    loading: false,
    valid: true,
    passwordShow: false,
    password: '',
    passwordRules: [
      (v: string) => !!v || 'Password is required',
      (v: string) => (v && v.length >= 5) || 'Password must be more than 5 characters',
    ],
    username: '',
    usernameRules: [
      (v: string) => !!v || 'Username is required',
      (v: string) => usernameRegex.test(v) || 'Username must be valid',
    ]
  }),

  computed: {

    form() {
      return this.$refs.form as HTMLFormElement;
    }

  },

  methods: {

    async submit() {
      this.form.validate();
      if (!this.valid) {
        return;
      }

      const username = this.username;

      this.loading = true;
      const res = await fetcher<LoginResponse>('POST', '/api/auth', {
        username,
        password: this.password
      });
      this.loading = false;

      if (!res.ok || !res.data?.token) {
        this.loginFail = true;
        return;
      }

      const jwt = res.data.token;
      const roles = res.data.user?.roles;

      await store.dispatch('login', {username, roles, jwt});
      await Vue.nextTick();
      this.$router.push('/products');

    }

  }

});
</script>

<style scoped>
#c-login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#login-card {
  width: 400px;
}
</style>
