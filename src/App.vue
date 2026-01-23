<template>
  <v-app>
    <!-- NOT LOGGED IN -->
    <LoginPage
      v-if="!isAuthenticated"
      @login-success="onLoginSuccess"
    />

    <!-- STUDENT PORTAL (NO SIDEBAR) -->
    <StudentPortal
      v-else-if="isAuthenticated && isStudent"
    />

    <!-- ADMIN DASHBOARD -->
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
import StudentPortal from "./views/StudentPortal.vue";

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
    StudentPortal,
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
      selectedPage: "Dashboard",
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "user"]),
    isStudent() {
      return this.user?.role === "student";
    },
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
    onLoginSuccess() {
      this.selectedPage = "Dashboard";
      this.$store.dispatch("students/fetchStudents");
    },
  },
};
</script>
