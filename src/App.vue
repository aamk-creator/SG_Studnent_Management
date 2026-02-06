<template>
  <v-app>
    <!-- LOGIN FORM -->
    <LoginPage v-if="!isAuthenticated" @login-success="onLoginSuccess" />

    <!-- ADMIN DASHBOARD -->
    <DashboardPage v-else />
  </v-app>
</template>

<script>
// Correct import paths based on your structure
import LoginPage from "./views/LoginPage.vue";
import DashboardPage from "./components/dashboard/DashboardPage.vue";

export default {
  name: "App",
  components: {
    LoginPage,
    DashboardPage,
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    onLoginSuccess(user) {
      // login-success from LoginPage should pass the user object
      this.$store.commit("SET_USER", user);
    },
  },
  created() {
    // auto-login if token exists
    this.$store.dispatch("autoLogin");
  },
};
</script>
