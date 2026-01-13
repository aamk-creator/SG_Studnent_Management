<template>
  <v-card class="mb-4">
    <v-card-text>
      <v-text-field label="Search student" @input="search" /> //AppTopbar
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods: {
    search(val) {
      this.$store.commit("students/SET_SEARCH", val);
    },
  },
};
</script>
