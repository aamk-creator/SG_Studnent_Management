<template>
  <v-container fluid class="grey lighten-5 py-10 px-12">
    <!-- Header -->
    <v-row align="center" class="mb-10">
      <v-avatar color="primary lighten-5" size="72" class="mr-5">
        <v-icon x-large color="primary">mdi-account-group-outline</v-icon>
      </v-avatar>

      <div>
        <h2 class="text-h6 font-weight-black grey--text text--darken-4 mb-0">
          Student Registration
        </h2>
        <span class="text-uppercase text-caption font-weight-bold primary--text">
          Manage and Monitor Student Records
        </span>
      </div>

      <v-spacer />

      <!-- IMPORT -->
      <v-btn
        color="primary"
        text
        x-large
        class="rounded-pill font-weight-bold mr-2"
        @click="$refs.importFile.click()"
        :disabled="loading"
      >
        <v-icon left>mdi-import</v-icon>
        Import CSV
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="20"
          class="ml-2"
        ></v-progress-circular>
      </v-btn>

      <!-- EXPORT -->
      <v-btn
        color="success"
        text
        x-large
        class="rounded-pill font-weight-bold"
        @click="exportStudents"
      >
        <v-icon left>mdi-export-variant</v-icon>
        Export CSV
      </v-btn>

      <!-- hidden file input -->
      <input
        ref="importFile"
        type="file"
        accept=".csv,text/csv"
        hidden
        @change="importStudents"
      />
    </v-row>

    <!-- Filters -->
    <v-card class="rounded-xl elevation-2 mb-12 border-0 overflow-hidden">
      <v-row no-gutters align="center" class="pa-4 blue-grey lighten-5">
        <v-col cols="auto" class="mr-4">
          <v-btn
            color="primary"
            dark
            depressed
            height="54"
            class="rounded-pill px-6 font-weight-bold"
            @click="opencard('add')"
          >
            <v-icon left>mdi-account-plus</v-icon>
            Add Student
          </v-btn>
        </v-col>

        <v-divider vertical class="mx-2" inset />

        <!-- Course Filter -->
        <v-col class="px-2">
          <v-select
            v-model="filterCourse"
            :items="[{ id: 'All', name: 'All' }, ...courses]"
            item-text="name"
            item-value="id"
            placeholder="Filter by Course"
            solo
            flat
            clearable
            hide-details
            prepend-inner-icon="mdi-book-open-outline"
          />
        </v-col>

        <!-- Branch Filter -->
        <v-col class="px-2">
          <v-select
            v-model="filterBranch"
            :items="[{ id: 'All', name: 'All' }, ...branches]"
            item-text="name"
            item-value="id"
            placeholder="Filter by Branch"
            solo
            flat
            clearable
            hide-details
            prepend-inner-icon="mdi-office-building-outline"
          />
        </v-col>

        <!-- Status Filter -->
        <v-col class="px-2">
          <v-select
            v-model="filterStatus"
            :items="['All', 'active', 'inactive']"
            placeholder="Status"
            solo
            flat
            clearable
            hide-details
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

    <!-- Table -->
    <v-card class="rounded-xl elevation-4 border-0 overflow-hidden">
      <StudentTable
        :filter-course="filterCourse"
        :filter-branch="filterBranch"
        :filter-status="filterStatus"
         :loading="progress"
        @edit-student="openEditStudent"
      />
    </v-card>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="600px" scrollable>
      <v-card class="rounded-xl">
        <v-toolbar flat>
          <v-toolbar-title class="font-weight-black">
            {{
              card === 'add'
                ? 'New Enrollment'
                : card === 'edit'
                ? 'Update Profile'
                : 'Confirm Removal'
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="cls"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-divider />

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

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import StudentTable from "./StudentTable.vue";
import AddStudent from "./AddStudent.vue";
import EditStudent from "./EditStudent.vue";
import DeleteStudent from "./DeleteStudent.vue";
import { mapActions, mapState } from "vuex";
import axios from "axios";

export default {
  name: "ViewStudent",
  components: {
    StudentTable,
    AddStudent,
    EditStudent,
    DeleteStudent,
  },
  data() {
    return {
      dialog: false,
      card: "",
      selectedStudent: null,

      filterCourse: "All",
      filterBranch: "All",
      filterStatus: "All",

      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",

      courses: [],
      branches: [],

      progress: false,
      maxFileSize: 2 * 1024 * 1024, // 2MB
    };
  },
  computed: {
    ...mapState("students", {
      allStudents: (state) => state.students,
    }),
  },
  methods: {
    ...mapActions("students", ["fetchStudents"]),

    opencard(type) {
      this.card = type;
      this.dialog = true;
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
      } catch {
        this.showSnackbar("Failed to load courses", "error");
      }
    },

    async fetchBranches() {
      try {
        const res = await axios.get("/branches");
        this.branches = res.data.data || [];
      } catch {
        this.showSnackbar("Failed to load branches", "error");
      }
    },

    /* ================= IMPORT ================= */
    async importStudents(e) {
      this.progress = true;
      const file = e.target.files[0];
      if (!file) return;

      if (!["text/csv", "application/vnd.ms-excel"].includes(file.type)) {
        this.showSnackbar("Only CSV files are allowed", "error");
        e.target.value = "";
        return;
      }

      if (file.size > this.maxFileSize) {
        this.showSnackbar("File size must be <= 2MB", "error");
        e.target.value = "";
        return;
      }

      // Read CSV locally to validate course/branch
      // const text = await file.text();
      // const rows = text.split("\n").map(r => r.split(","));

      // const invalidRows = [];
      // rows.forEach((row, i) => {
      //   const [ , , , , , , courseName, branchName] = row;

      //   const courseExists = this.courses.some(
      //     c => c.name.trim().toLowerCase() === courseName?.trim().toLowerCase()
      //   );
      //   const branchExists = this.branches.some(
      //     b => b.name.trim().toLowerCase() === branchName?.trim().toLowerCase()
      //   );

      //   if (!courseExists || !branchExists) {
      //     invalidRows.push(i + 1); // CSV rows start at 1
      //   }
      // });

      // if (invalidRows.length) {
      //   this.showSnackbar(
      //     `Invalid course/branch names in rows: ${invalidRows.join(", ")}`,
      //     "error"
      //   );
      //   e.target.value = "";
      //   return;
      // }

      const formData = new FormData();
      formData.append("file", file);

      this.loading = true;

      try {
        const res = await axios.post("/students/import", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.status) {
          this.showSnackbar(res.data.message, "success");

            await this.fetchStudents();

        } else {
          this.showSnackbar(res.data.message || "Import failed", "error");
        }
      } catch (err) {
        console.error(err);
        this.showSnackbar(
          err.response?.data?.message || "Import failed due to server error",
          "error"
        );
      } finally {
        this.loading = false;
        e.target.value = "";
      }
                this.progress = false;
    },

    /* ================= EXPORT ================= */
    exportStudents() {
      let students = this.allStudents;

      if (!students.length) {
        this.showSnackbar("No students to export", "error");
        return;
      }

      // Apply filters
      if (this.filterCourse && this.filterCourse !== "All") {
        students = students.filter((s) => s.course?.id === this.filterCourse);
      }
      if (this.filterBranch && this.filterBranch !== "All") {
        students = students.filter((s) => s.branch?.id === this.filterBranch);
      }
      if (this.filterStatus && this.filterStatus !== "All") {
        students = students.filter((s) => s.status === this.filterStatus);
      }

      const headers = ["ID", "Code", "Name", "Course", "Branch", "Status"];
      const rows = students.map((s) => [
        s.id,
        s.code,
        s.name,
        s.course?.name || "",
        s.branch?.name || "",
        s.status,
      ]);

      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "students_export.csv";
      link.click();

      this.showSnackbar("Students exported successfully");
    },

    showSnackbar(msg, color = "success") {
      this.snackbarText = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
  mounted() {
    this.fetchStudents();
    this.fetchCourses();
    this.fetchBranches();
  },
};
</script>

<style scoped>
.border-2 {
  border-width: 2px !important;
}
</style>
