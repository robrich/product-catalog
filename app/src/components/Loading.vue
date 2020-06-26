<template>
  <v-card
    class="mx-auto loading"
    max-width="400"
    data-cy="c-loading"
  >
    <v-card-title>
      <v-icon
        large
        left
      >
        mdi-twitter
      </v-icon>
      <span class="title font-weight-light">Loading ...</span>
    </v-card-title>
  </v-card>
</template>

<style scoped>
.loading {
  margin: 200px auto;
}
</style>
