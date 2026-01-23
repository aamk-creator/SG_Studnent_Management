<template>
  <v-container fluid>
    <!-- ACTION CARD -->
    <v-card class="mb-6 pa-4 elevation-3 rounded-lg">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon left color="primary" large>
            mdi-account-multiple-outline
          </v-icon>
          <span class="card-title">View All Students</span>
        </div>
      </v-card-title>

      <v-card-text class="pb-0">
        <span>View and manage all student records efficiently.</span>

        <!--         
        <v-row class="mt-4" dense>
          <v-col cols="12" sm="6">
            <v-select
              label="Filter by Course"
              :items="courses"
              item-text="name"
              item-value="id"
              v-model="filterCourse"
              outlined
              dense
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              label="Filter by Status"
              :items="['active', 'inactive']"
              v-model="filterStatus"
              outlined
              dense
              clearable
            />
          </v-col>
        </v-row> -->
      </v-card-text>

      <v-card-actions class="pt-2">
        <v-btn
          color="primary"
          rounded
          small
          class="mr-3"
          @click="opencard('add')"
        >
          <v-icon left>mdi-account-plus</v-icon>
          Add Student
        </v-btn>

        <v-btn
          color="red"
          rounded
          small
          class="mr-3"
          @click="opencard('delete')"
        >
          <v-icon left>mdi-account-remove</v-icon>
          Delete Student
        </v-btn>

        <v-btn color="green" rounded small @click="exportStudents">
          <v-icon left>mdi-export</v-icon>
          Export Students
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- STUDENT TABLE -->
    <StudentTable
      :filter-course="filterCourse"
      :filter-status="filterStatus"
      @edit-student="openEditStudent"
    />

    <!-- DIALOG -->
    <v-dialog
      v-model="dialog"
      max-width="600px"
      scrollable
      @click:outside="cls"
    >
      <v-card class="rounded-lg">
        <AddStudent v-if="card === 'add'" @close-dialog="cls" />
        <DeleteStudent v-if="card === 'delete'" @close-dialog="cls" />
        <EditStudent
          v-if="card === 'edit'"
          :student="selectedStudent"
          @close-dialog="cls"
        />
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
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
.card-title {
  font-weight: 600;
  font-size: 20px;
}
.v-card {
  border-radius: 12px;
}
.v-card-actions .v-btn {
  text-transform: none;
}
</style>
