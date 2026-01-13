<template>
  <v-app>
    <!-- Show LoginPage if not authenticated -->
    <LoginPage v-if="!isAuthenticated" @login-success="onLoginSuccess" />

    <!-- Main app layout after login -->
    <template v-else>
      <AppTopbar @toggle-drawer="toggleDrawer" />

      <AppSidebar
        v-model="drawer"
        :mini="mini"
        :selectedPage="selectedPage"
        @select-page="selectedPage = $event"
      />

      <v-main>
        <v-container fluid>
          <Dashboard v-if="selectedPage === 'Dashboard'" />
          <ViewStudent v-if="selectedPage === 'ViewStudent'" />
          <AddStudent v-if="selectedPage === 'AddStudent'" />
          <DeleteStudent v-if="selectedPage === 'DeleteStudent'" />
          <AllCourses v-if="selectedPage === 'AllCourses'" />
        </v-container>
      </v-main>

      <AppFooter />
    </template>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

import LoginPage from "./views/LoginPage.vue";
import AppSidebar from "./components/layout/AppSidebar.vue";
import AppTopbar from "./components/layout/AppTopbar.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import Dashboard from "./components/dashboard/DashboardPage.vue";
import ViewStudent from "./components/student/ViewStudent.vue";
import AddStudent from "./components/student/AddStudent.vue";
import DeleteStudent from "./components/student/DeleteStudent.vue";
import AllCourses from "./components/subject/AllCourses.vue";

export default {
  name: "App",
  components: {
    LoginPage,
    AppSidebar,
    AppTopbar,
    AppFooter,
    Dashboard,
    ViewStudent,
    AddStudent,
    DeleteStudent,
    AllCourses,
  },
  data() {
    return {
      drawer: true,
      mini: false,
      selectedPage: "Dashboard", // default page after login
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    toggleDrawer() {
      if (this.drawer) {
        this.mini = !this.mini;
      } else {
        this.drawer = true;
        this.mini = false;
      }
    },

    // Called when login succeeds
    onLoginSuccess() {
      this.selectedPage = "Dashboard";
    },
  },
};
</script>
