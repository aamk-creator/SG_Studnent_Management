<template>
  <v-app>
    <!-- STUDENT LOGIN -->
    <template v-if="!isAuthenticated">
      <LoginPage @login-success="onLoginSuccess" />
    </template>

    <!-- STUDENT PORTAL -->
    <template v-else-if="isAuthenticated && isStudent">
      <v-app-bar color="primary" dark>
        <v-toolbar-title>Student Portal</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="logout">Logout</v-btn>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <StudentPortal />
        </v-container>
      </v-main>
    </template>

    <!-- FALLBACK -->
    <template v-else>
      <v-container class="fill-height d-flex justify-center align-center">
        <v-card>
          <v-card-title>Error: Invalid user role</v-card-title>
        </v-card>
      </v-container>
    </template>
  </v-app>
</template>

<script>
// Use **relative paths** to match your current folders
import LoginPage from "./views/LoginPage.vue";
import StudentPortal from "./views/StudentPortal.vue";

import { mapGetters } from "vuex";

export default {
  name: "App",
  components: { LoginPage, StudentPortal },
  computed: {
    ...mapGetters(["isAuthenticated", "user"]),
    isStudent() {
      return this.user?.role === "student";
    },
  },
  methods: {
    onLoginSuccess() {
      console.log("Student logged in successfully!");
    },
    logout() {
      localStorage.removeItem("student_token");
      this.$store.commit("auth/setUser", null);
      location.reload(); // reset login state
    },
  },
  mounted() {
    // Check token on page load
    const token = localStorage.getItem("student_token");
    if (token) {
      this.$axios.get("/student/me")
        .then(res => {
          this.$store.commit("auth/setUser", { ...res.data.data, role: "student" });
        })
        .catch(err => {
          console.error("Invalid token, logging out", err);
          localStorage.removeItem("student_token");
        });
    }
  },
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
