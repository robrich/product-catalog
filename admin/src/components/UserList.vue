<template>
  <v-container data-cy="c-user-list">
    <v-card
      data-cy="user-list-card"
    >
      <v-data-table
        :headers="headers"
        :items="value"
        class="elevation-1"
      >
        <template v-slot:item.username="{ item }">
          <router-link :to="`/user/${item.username}`">
            {{ item.username }}
          </router-link>
        </template>
        <template v-slot:item.catalogReadOnly="{ item }">
          <v-switch
            v-model="item.catalogReadOnly"
            class="table-switch"
            @change="change(item)"
          ></v-switch>
        </template>
        <template v-slot:item.catalogEditor="{ item }">
          <v-switch
            v-model="item.catalogEditor"
            class="table-switch"
            @change="change(item)"
          ></v-switch>
        </template>
        <template v-slot:item.userEditor="{ item }">
          <v-switch
            v-model="item.userEditor"
            class="table-switch"
            @change="change(item)"
          ></v-switch>
        </template>
        <template v-slot:item.secret="{ item }">
          <v-edit-dialog
            :return-value.sync="item.secret"
            large
            persistent
            @open="clearPassword(item)"
            @save="setPassword(item)"
          >
            <v-icon>fa-key</v-icon>
            <template v-slot:input>
              <v-text-field
                v-model="item.secret"
                label="New Password"
                single-line
                autofocus
                :append-icon="passwordShow ? 'fas fa-eye-slash' : 'fas fa-eye'"
                @click:append="() => (passwordShow = !passwordShow)"
                :type="passwordShow ? 'text' : 'password'"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { UserModel } from '../types/user-model';


export default Vue.extend({

  data: () => ({
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Catalog Read Only', value: 'catalogReadOnly', align: 'center' },
      { text: 'Catalog Editor', value: 'catalogEditor', align: 'center' },
      { text: 'User Editor', value: 'userEditor', align: 'center' },
      { text: 'Set Password', value: 'secret', align: 'center' }
    ],
    passwordShow: true,
    passwordRules: [
      (v: string) => !!v || 'Password is required',
      (v: string) => (v && v.length >= 5) || 'Password must be more than 5 characters'
    ]
  }),

  props: {
    value: {
      type: Array as () => UserModel[],
      required: true
    }
  },

  methods: {

    change(user: UserModel) {
      this.$emit('changeUser', user);
    },

    async clearPassword(user: UserModel) {
      delete user.secret;
      await Vue.nextTick();
    },

    async setPassword(user: UserModel) {
      if (!user.secret || user.secret.length < 5) {
        return;
      }
      const changedUser = Object.assign({}, user);
      this.$emit('changeUser', changedUser);
      await Vue.nextTick();
      delete user.secret;
    }

  }

});
</script>

<style scoped>
.table-switch {
  width: 50px;
  margin-left: auto;
  margin-right: auto;
}
</style>
