<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>
      
      <v-btn
        v-if="isAuthenticated"
        to="/products"
        text
      >
        Product List
      </v-btn>

      <v-btn
        v-if="isUserEditor"
        to="/users"
        text
      >
        Users
      </v-btn>

      <v-btn
        v-if="isAuthenticated"
        to="/about"
        text
      >
        About
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        v-if="isAuthenticated"
        to="/logout"
        text
      >
        Logout
      </v-btn>
      <v-btn
        v-if="!isAuthenticated"
        to="/"
        text
      >
        Login
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),

  computed: {
    ...mapGetters([
      'isAuthenticated',
      'isUserEditor'
    ])
  }

});
</script>
