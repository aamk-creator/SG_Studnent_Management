<template>
  <v-container fluid class="grey lighten-5 py-10 px-12">
    <v-row align="center" class="mb-10">
      <v-avatar color="primary lighten-5" size="72" class="mr-5">
        <v-icon x-large color="primary">mdi-account-group-outline</v-icon>
      </v-avatar>
      <div>
        <h2 class="display-1 font-weight-black grey--text text--darken-4 mb-0">Student Registration</h2>
        <span class="text-uppercase overline font-weight-bold primary--text">Manage and Monitor student Records</span>
      </div>
      <v-spacer />
      <v-btn color="success" text x-large class="rounded-pill font-weight-bold" @click="exportStudents">
        <v-icon left>mdi-export-variant</v-icon>
        Export CSV
      </v-btn>
    </v-row>

    <div class="d-flex align-center mb-3 ml-2">
      <v-icon small color="primary" class="mr-2">mdi-filter-variant</v-icon>
      <span class="text-uppercase font-weight-black grey--text text--darken-1 subtitle-2" style="letter-spacing: 1px">
        Quick Actions & Filters
      </span>
    </div>

    <v-card class="rounded-xl elevation-2 mb-12 border-0 overflow-hidden">
      <v-row no-gutters align="center" class="pa-4 blue-grey lighten-5">
        <v-col cols="auto" class="mr-4">
          <v-btn
            color="primary"
            dark depressed
            height="54"
            class="rounded-pill px-6 font-weight-bold"
            @click="opencard('add')"
          >
            <v-icon left>mdi-account-plus</v-icon>
            Add Student
          </v-btn>
        </v-col>

        <v-divider vertical class="mx-2" inset></v-divider>

        <v-col class="px-2">
          <v-select
            v-model="filterCourse"
            :items="courses"
            item-text="name"
            item-value="id"
            placeholder="Filter by Course"
            flat solo hide-details
            clearable
            background-color="white"
            class="rounded-lg shadow-sm"
            prepend-inner-icon="mdi-book-open-outline"
          />
        </v-col>

        <v-col class="px-2">
          <v-select
            v-model="filterStatus"
            :items="['active', 'inactive']"
            placeholder="Status"
            flat solo hide-details
            clearable
            background-color="white"
            class="rounded-lg shadow-sm"
            prepend-inner-icon="mdi-shield-check-outline"
          />
        </v-col>

        <v-col cols="auto" class="ml-4">
          <v-btn
            color="red lighten-1"
            outlined
            height="54"
            class="rounded-pill font-weight-bold border-2"
            @click="opencard('delete')"
          >
            <v-icon left>mdi-account-remove-outline</v-icon>
            Remove
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div class="d-flex align-center mb-3 ml-2">
      <v-icon small color="blue-grey" class="mr-2">mdi-format-list-bulleted</v-icon>
      <span class="text-uppercase font-weight-black grey--text text--darken-1 subtitle-2" style="letter-spacing: 1px">
        All Students Info
      </span>
    </div>

    <v-card class="rounded-xl elevation-4 border-0 overflow-hidden">
      <StudentTable
        :filter-course="filterCourse"
        :filter-status="filterStatus"
        @edit-student="openEditStudent"
        class="custom-modern-table"
      />
    </v-card>

    <v-dialog
      v-model="dialog"
      max-width="600px"
      scrollable
      transition="dialog-bottom-transition"
      @click:outside="cls"
    >
      <v-card class="rounded-xl overflow-hidden shadow-2xl">
        <v-toolbar flat color="white" class="px-2">
          <v-toolbar-title class="font-weight-black grey--text text--darken-4">
            {{ card === 'add' ? 'New Enrollment' : card === 'edit' ? 'Update Profile' : 'Confirm Removal' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cls"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        
        <v-divider></v-divider>
        
        <div class="pa-6">
          <AddStudent v-if="card === 'add'" @close-dialog="cls" />
          <DeleteStudent v-if="card === 'delete'" @close-dialog="cls" />
          <EditStudent
            v-if="card === 'edit'"
            :student="selectedStudent"
            @close-dialog="cls"
          />
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" rounded="pill" elevation="10" timeout="3000">
      <span class="font-weight-bold">{{ snackbarText }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false" class="rounded-pill">Dismiss</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import StudentTable from "./StudentTable.vue";
import DeleteStudent from "./DeleteStudent.vue";
import AddStudent from "./AddStudent.vue";
import EditStudent from "./EditStudent.vue";
import { mapState, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "ViewStudent",
  components: {
    StudentTable,
    AddStudent,
    DeleteStudent,
    EditStudent,
  },
  data() {
    return {
      dialog: false,
      card: "",
      selectedStudent: null,

      // Filters
      filterCourse: null,
      filterStatus: null,

      // Snackbar
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",

      // Courses for filter
      courses: [],
    };
  },
  computed: {
    ...mapState("students", {
      allStudents: (state) => state.students,
    }),
  },
  methods: {
    ...mapActions("students", ["fetchStudents"]),

    opencard(cardName) {
      this.dialog = true;
      this.card = cardName;
    },

    cls() {
      this.dialog = false;
      this.card = "";
      this.selectedStudent = null;
    },

    openEditStudent(student) {
      this.selectedStudent = student;
      this.card = "edit";
      this.dialog = true;
    },

    async fetchCourses() {
      try {
        const res = await axios.get("/courses");
        this.courses = res.data.data || [];
      } catch (err) {
        console.error("Fetch courses failed:", err);
        this.showSnackbar("Failed to fetch courses", "error");
      }
    },

    exportStudents() {
      let students = this.allStudents;
      if (this.filterCourse) {
        students = students.filter((s) => s.course?.id === this.filterCourse);
      }
      if (this.filterStatus) {
        students = students.filter((s) => s.status === this.filterStatus);
      }

      if (!students.length) {
        this.showSnackbar("No students to export", "error");
        return;
      }

      // CSV Header
      const headers = ["ID", "Code", "Name", "Course", "Branch", "Status"];
      const rows = students.map((s) => [
        s.id,
        s.code,
        s.name,
        s.course?.name || "",
        s.branch?.name || "",
        s.status,
      ]);

      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showSnackbar("Students exported successfully", "success");
    },

    showSnackbar(message, color = "success") {
      this.snackbarText = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
  mounted() {
    this.fetchStudents();
    this.fetchCourses();
  },
};
</script>

<style scoped>
/* High-End Design System */
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
}

.border-2 {
  border-width: 2px !important;
}

/* Custom Table Styling overrides for the child component */
.custom-modern-table >>> .v-data-table__wrapper {
  border-radius: 0 0 24px 24px;
}

.custom-modern-table >>> thead {
  background-color: #F8FAFC !important;
}

.custom-modern-table >>> th {
  text-transform: uppercase !important;
  font-weight: 800 !important;
  letter-spacing: 0.8px;
  color: #64748B !important;
  font-size: 0.75rem !important;
  border-bottom: none !important;
  height: 56px !important;
}

.custom-modern-table >>> td {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  border-bottom: 1px solid #F1F5F9 !important;
}

.border-0 {
  border: none !important;
}

.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}
</style>
