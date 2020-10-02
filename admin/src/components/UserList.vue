<template>
  <v-container data-cy="c-user-list">
    <v-dialog
      v-model="dialogOpen"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-row>
          <v-col class="text-right">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fa-user-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">New User</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="newUserForm" @submit.prevent="saveNewUser">
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    label="Username"
                    required
                    v-model="newUsername"
                    :rules="usernameRules"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    label="Password"
                    required
                    v-model="newPassword"
                    :rules="passwordRules"
                    :append-icon="passwordShow ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    @click:append="() => (passwordShow = !passwordShow)"
                    :type="passwordShow ? 'text' : 'password'"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeNewUser"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click.prevent="saveNewUser"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card
      data-cy="user-list-card"
    >
      <v-data-table
        :headers="headers"
        :items="value"
        class="elevation-1"
        :dense="true"
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
        <template v-slot:item.delete="{ item }">
          <v-icon color="#E53935" @click.prevent="deleteUser(item)">fas fa-times-circle</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { usernameRegex } from '../types/user';
import { UserModel } from '../types/user-model';


export default Vue.extend({

  data: () => ({
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Catalog Read Only', value: 'catalogReadOnly', align: 'center' },
      { text: 'Catalog Editor', value: 'catalogEditor', align: 'center' },
      { text: 'User Editor', value: 'userEditor', align: 'center' },
      { text: 'Set Password', value: 'secret', align: 'center' },
      { text: 'Delete', value: 'delete', align: 'center' }
    ],
    dialogOpen: false,
    newUsername: '',
    newPassword: '',
    passwordShow: true,
    usernameRules: [
      (v: string) => !!v || 'Username is required',
      (v: string) => usernameRegex.test(v) || 'Username must be 5-32 lower-case letters'
    ],
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

  computed: {

    newUserForm() {
      return this.$refs.newUserForm as HTMLFormElement & {
        resetValidation: () => void;
      };
    }

  },

  methods: {

    change(user: UserModel) {
      this.$emit('userChanged', user);
    },

    async clearPassword(user: UserModel) {
      delete user.secret;
      await Vue.nextTick();
    },

    async setPassword(user: UserModel) {
      if (!user.secret || user.secret.length < 5) {
        return; // do nothing
      }
      const changedUser = Object.assign({}, user);
      this.$emit('userChanged', changedUser);
      await Vue.nextTick();
      delete user.secret;
    },

    deleteUser(user: UserModel) {
      this.$emit('userDeleted', user);
    },

    async saveNewUser() {

      const valid = this.newUserForm.validate();
      if (!valid) {
        return;
      }
      
      this.dialogOpen = false;

      const user: UserModel = {
        username: this.newUsername,
        secret: this.newPassword,
        catalogReadOnly: false,
        catalogEditor: false,
        userEditor: false
      };
      this.$emit('userChanged', user);

      await Vue.nextTick();
      delete user.secret;
      this.value.push(user);
      await this.closeNewUser();
    },

    async closeNewUser() {
      this.dialogOpen = false;
      await Vue.nextTick();
      this.newUsername = '';
      this.newPassword = '';
      this.newUserForm.resetValidation();
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
