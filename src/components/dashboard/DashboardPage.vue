<template>
  <v-app>
    <AppSidebar
      :selected-page="selectedPage"
      :mini="mini"
      @select-page="selectedPage = $event"
    />

    <AppTopbar @toggle-drawer="mini = !mini" />

    <v-main class="bg-grey lighten-4">
      <v-container fluid class="py-8 px-10">
        <template v-if="selectedPage === 'Dashboard'">
          <v-row class="mb-6">
            <v-col cols="12" sm="4">
              <v-card color="teal darken-1" dark elevation="2" rounded="lg">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-uppercase caption">
                      Total Students
                    </v-list-item-subtitle>
                    <v-list-item-title class="display-1">
                      {{ totalStudents }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-icon size="48" class="opacity-60">mdi-school</v-icon>
                </v-list-item>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4">
              <v-card color="indigo darken-1" dark elevation="2" rounded="lg">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-uppercase caption">
                      Total Courses
                    </v-list-item-subtitle>
                    <v-list-item-title class="display-1">
                      {{ totalCourses }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-icon size="48" class="opacity-60">mdi-book-open-variant</v-icon>
                </v-list-item>
              </v-card>
            </v-col>

            <v-col cols="12" sm="4">
              <v-card color="blue-grey darken-1" dark elevation="2" rounded="lg">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-uppercase caption">
                      Total Branches
                    </v-list-item-subtitle>
                    <v-list-item-title class="display-1">
                      {{ totalBranches }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-icon size="48" class="opacity-60">mdi-map-marker-radius</v-icon>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mb-6">
            <v-col cols="12">
              <v-card elevation="2" rounded="lg">
                <v-sheet class="v-sheet--offset mx-auto" color="transparent" max-width="calc(100% - 32px)">
                  <!-- optional chart or content -->
                </v-sheet>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <StudentTable />
            </v-col>
          </v-row>
        </template>

        <template v-else-if="selectedPage === 'ViewStudent'">
          <ViewStudent />
        </template>
        <template v-else-if="selectedPage === 'AllCourses'">
          <AllCourses />
        </template>
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppTopbar from "@/components/layout/AppTopbar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

import StudentTable from "@/components/student/StudentTable.vue";
import ViewStudent from "@/components/student/ViewStudent.vue";
import AllCourses from "@/components/subject/AllCourses.vue";

export default {
  name: "DashboardPage",
  components: {
    AppSidebar,
    AppTopbar,
    AppFooter,
    StudentTable,
    ViewStudent,
    AllCourses,
  },
  data() {
    return {
      mini: false,
      selectedPage: "Dashboard",
    };
  },
  computed: {
    // Pull counts directly from Vuex (reactive)
    totalStudents() {
      return this.$store.getters["students/totalStudents"];
    },
    totalCourses() {
      return this.$store.getters["students/totalCourses"];
    },
    totalBranches() {
      return this.$store.getters["students/totalBranches"];
    },
  },
  created() {
    // Fetch all data for dashboard
    this.$store.dispatch("students/fetchStudents");
    this.$store.dispatch("students/fetchCourses");
    this.$store.dispatch("students/fetchBranches");
  },
};
</script>

<style scoped>
.bg-grey {
  background-color: #f8f9fa !important;
}
.v-sheet--offset {
  top: -10px;
  position: relative;
}
.opacity-60 {
  opacity: 0.6;
}
</style>
