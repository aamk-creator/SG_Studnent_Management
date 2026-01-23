<template>
  <v-container fluid>
    <!-- Header -->
    <v-card class="mb-6">
      <v-card-title>
        <v-icon left color="primary">mdi-book-open-outline</v-icon>
        Courses Management
      </v-card-title>
    </v-card>

    <!-- Branch Management -->
    <v-card class="mb-6">
      <v-card-title>Add New Branch</v-card-title>
      <v-card-text>
        <v-form v-model="validBranch">
          <v-text-field
            label="Branch Name"
            v-model="newBranch.name"
            :rules="[(v) => !!v || 'Branch name is required']"
            outlined
          />
          <v-btn
            color="primary"
            :disabled="!validBranch || loadingBranch"
            :loading="loadingBranch"
            @click="addBranch"
            class="mt-4"
          >
            Add Branch
          </v-btn>
        </v-form>
      </v-card-text>

      <v-data-table
        :headers="branchHeaders"
        :items="branches"
        item-key="id"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon color="red" @click="confirmDeleteBranch(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Course Management -->
    <v-card class="mb-6">
      <v-card-title>Add New Course</v-card-title>
      <v-card-text>
        <v-form v-model="validCourse">
          <v-text-field
            label="Course Name"
            v-model="newCourse.name"
            :rules="[(v) => !!v || 'Course name is required']"
            outlined
          />
          <v-text-field label="Title" v-model="newCourse.title" outlined />
          <v-textarea
            label="Description"
            v-model="newCourse.description"
            outlined
          />
          <v-select
            label="Select Branch"
            :items="branches"
            item-text="name"
            item-value="id"
            v-model="newCourse.branch_id"
            :rules="[(v) => !!v || 'Branch is required']"
            outlined
          />

          <!-- Start Date -->
          <v-menu
            v-model="startMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="newCourse.course_start_at"
                label="Course Start Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              />
            </template>
            <v-date-picker
              v-model="newCourse.course_start_at"
              @input="startMenu = false"
            />
          </v-menu>

          <!-- End Date -->
          <v-menu
            v-model="endMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="newCourse.course_end_at"
                label="Course End Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              />
            </template>
            <v-date-picker
              v-model="newCourse.course_end_at"
              @input="endMenu = false"
            />
          </v-menu>

          <v-btn
            color="primary"
            :disabled="!validCourse || loadingCourse"
            :loading="loadingCourse"
            @click="addCourse"
            class="mt-4"
          >
            Add Course
          </v-btn>
        </v-form>
      </v-card-text>

      <v-data-table
        :headers="courseHeaders"
        :items="courses"
        item-key="id"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:[`item.course_start_at`]="{ item }">
          {{ formatDate(item.course_start_at) }}
        </template>
        <template v-slot:[`item.course_end_at`]="{ item }">
          {{ formatDate(item.course_end_at) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon color="red" @click="confirmDeleteCourse(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn icon color="green" @click="openCourseModal(item)">
            <v-icon>mdi-certificate</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Issue Certificate Modal -->
    <v-dialog v-model="courseModal" max-width="600">
      <v-card>
        <v-card-title class="headline">
          Issue Courses Certificate - {{ selectedCourse?.name }}
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="studentHeaders"
            :items="courseStudents"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:[`item.course_start_at`]="{ item }">
              {{ formatDate(item.course_start_at) }}
            </template>
            <template v-slot:[`item.course_end_at`]="{ item }">
              {{ formatDate(item.course_end_at) }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="primary" small @click="issueCertificate(item)">
                Issue
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey" @click="closeCourseModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete
          <strong>{{ itemToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey" @click="cancelDelete">Cancel</v-btn>
          <v-btn color="red" @click="performDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "AllCourses",
  data() {
    return {
      /* Branch */
      validBranch: false,
      loadingBranch: false,
      newBranch: { name: "" },
      branches: [],
      branchHeaders: [
        { text: "Branch Name", value: "name" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      /* Course */
      validCourse: false,
      loadingCourse: false,
      newCourse: {
        name: "",
        title: "",
        description: "",
        branch_id: null,
        course_start_at: null,
        course_end_at: null,
      },
      startMenu: false,
      endMenu: false,
      courses: [],
      courseHeaders: [
        { text: "Course Name", value: "name" },
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Branch", value: "branch.name" },
        { text: "Start Date", value: "course_start_at" },
        { text: "End Date", value: "course_end_at" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      /* Students */
      courseModal: false,
      selectedCourse: null,
      courseStudents: [],
      studentHeaders: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Start Date", value: "course_start_at" },
        { text: "End Date", value: "course_end_at" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      /* Delete */
      confirmDeleteDialog: false,
      itemToDelete: null,
      deleteType: null,

      /* Snackbar */
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
    };
  },
  methods: {
    // Format date
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : "-";
    },

    /* Branch Methods */
    async fetchBranches() {
      try {
        const res = await axios.get("/branches");
        this.branches = res.data.data || [];
        if (this.branches.length && !this.newCourse.branch_id)
          this.newCourse.branch_id = this.branches[0].id;
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to fetch branches", "error");
      }
    },
    async addBranch() {
      if (!this.newBranch.name) return;
      this.loadingBranch = true;
      try {
        const res = await axios.post("/branches", this.newBranch);
        this.branches.push(res.data.data || res.data);
        this.newBranch.name = "";
        this.validBranch = false;
        this.showSnackbar("Branch added", "success");
      } catch (err) {
        console.error(err);
        this.showSnackbar(
          err.response?.data?.message || "Failed to add branch",
          "error"
        );
      } finally {
        this.loadingBranch = false;
      }
    },

    /* Course Methods */
    async fetchCourses() {
      try {
        const res = await axios.get("/courses");
        this.courses = res.data.data || [];
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to fetch courses", "error");
      }
    },
    async addCourse() {
      if (!this.newCourse.name || !this.newCourse.branch_id) return;
      this.loadingCourse = true;
      try {
        const res = await axios.post("/courses", this.newCourse);
        this.courses.push(res.data.data || res.data);
        this.newCourse = {
          name: "",
          title: "",
          description: "",
          branch_id: this.branches.length ? this.branches[0].id : null,
          course_start_at: null,
          course_end_at: null,
        };
        this.validCourse = false;
        this.showSnackbar("Course added", "success");
      } catch (err) {
        console.error(err);
        this.showSnackbar(
          err.response?.data?.message || "Failed to add course",
          "error"
        );
      } finally {
        this.loadingCourse = false;
      }
    },

    /* Delete Methods */
    confirmDeleteBranch(branch) {
      this.itemToDelete = branch;
      this.deleteType = "branch";
      this.confirmDeleteDialog = true;
    },
    confirmDeleteCourse(course) {
      this.itemToDelete = course;
      this.deleteType = "course";
      this.confirmDeleteDialog = true;
    },
    cancelDelete() {
      this.itemToDelete = null;
      this.deleteType = null;
      this.confirmDeleteDialog = false;
    },
    async performDelete() {
      if (!this.itemToDelete || !this.deleteType) return;
      try {
        if (this.deleteType === "branch") {
          await axios.delete(`/branches/${this.itemToDelete.id}`);
          this.branches = this.branches.filter((b) => b.id !== this.itemToDelete.id);
        } else if (this.deleteType === "course") {
          await axios.delete(`/courses/${this.itemToDelete.id}`);
          this.courses = this.courses.filter((c) => c.id !== this.itemToDelete.id);
        }
        this.showSnackbar("Deleted successfully", "success");
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to delete", "error");
      } finally {
        this.cancelDelete();
      }
    },

    /* Students Modal */
    openCourseModal(course) {
      this.selectedCourse = course;
      this.courseModal = true;
      this.fetchCourseStudents(course.id);
    },
    closeCourseModal() {
      this.selectedCourse = null;
      this.courseStudents = [];
      this.courseModal = false;
    },
    async fetchCourseStudents(courseId) {
      try {
        const res = await axios.get(`/courses/${courseId}/students`);
        this.courseStudents = res.data.data || [];
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to fetch students", "error");
      }
    },
    async issueCertificate(student) {
      try {
        await axios.post("/certificates", {
          student_id: student.id,
          course_id: this.selectedCourse.id,
        });
        this.showSnackbar(`Certificate issued to "${student.name}"`);
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to issue certificate", "error");
      }
    },

    /* Snackbar */
    showSnackbar(message, color = "success") {
      this.snackbarText = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },

  mounted() {
    this.fetchBranches();
    this.fetchCourses();
  },
};
</script>
