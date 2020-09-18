<template>
  <div id="product-list">
    <h1>Product list</h1>
    <Loading v-if="loading" />
    <div v-else>
      <user-list v-model="users" v-if="users.length" @changeUser="saveUser" />
      <error v-if="errored" :status="status" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import fetcher, { Response } from '../services/fetcher';
import { User } from '../types/user';
import { userFromModel, UserModel, userToModel } from '../types/user-model';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';
import UserList from '@/components/UserList.vue';


interface UserListModel {
  loading: boolean;
  page: number;
  errored: boolean;
  status: number;
  users: UserModel[];
}

export default Vue.extend({

  components: {
    Loading,
    Error,
    UserList
  },

  data() {
    const data: UserListModel = {
      loading: true,
      page: 0,
      status: 0,
      errored: false,
      users: []
    };
    return data;
  },

  async mounted() {
    this.loading = true;
    this.page = parseInt(this.$route.params.page, 10);
    if (this.page < 0 || isNaN(this.page)) {
      this.page = 0;
    }

    const result: Response<User[]> = await fetcher<User[]>('GET', `/api/users/${this.page}`);
    this.status = result.status;
    if (this.status < 300 && result.data) {
      this.users = result.data.map(userToModel);
    } else {
      this.users = [];
    }
    this.errored = (result.status >= 500);
    this.loading = false;
  },

  methods: {

    async saveUser(userModel: UserModel) {

      const user = userFromModel(userModel);

      const result: Response<User> = await fetcher<User>('POST', '/api/user', user);

      if (!result.ok) {
        // TODO: show error message
      }

    }

  }

});
</script>

<style scoped>

</style>
