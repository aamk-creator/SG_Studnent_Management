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
            :rules="[v => !!v || 'Branch name is required']"
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
          <v-btn icon color="red" @click="deleteBranch(item.id)">
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
            :rules="[v => !!v || 'Course name is required']"
            outlined
          />
          <v-text-field
            label="Title"
            v-model="newCourse.title"
            outlined
          />
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
            :rules="[v => !!v || 'Branch is required']"
            outlined
          />
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon color="red" @click="deleteCourse(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "AllCoursesAndBranches",
  data() {
    return {
      /* ---------- Branch ---------- */
      validBranch: false,
      loadingBranch: false,
      newBranch: { name: "" },
      branches: [],
      branchHeaders: [
        { text: "Branch Name", value: "name" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      /* ---------- Course ---------- */
      validCourse: false,
      loadingCourse: false,
      newCourse: { name: "", title: "", description: "", branch_id: null },
      courses: [],
      courseHeaders: [
        { text: "Course Name", value: "name" },
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Branch", value: "branch.name" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      /* ---------- Snackbar ---------- */
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
    };
  },
  methods: {
    /* ---------- Branch Methods ---------- */
    async fetchBranches() {
      try {
        const res = await axios.get("/branches");
        this.branches = res.data.data || [];
        if (this.branches.length && !this.newCourse.branch_id) {
          this.newCourse.branch_id = this.branches[0].id;
        }
      } catch (err) {
        console.error("Fetch branches failed:", err);
        this.showSnackbar("Failed to fetch branches", "error");
      }
    },
    async addBranch() {
      if (!this.newBranch.name) return;
      this.loadingBranch = true;
      try {
        const res = await axios.post("/branches", this.newBranch);
        this.branches.push(res.data);
        this.showSnackbar(`Branch "${res.data.name}" added`, "success");
        this.newBranch.name = "";
        this.validBranch = false;
        if (!this.newCourse.branch_id) {
          this.newCourse.branch_id = res.data.id;
        }
      } catch (err) {
        console.error("Add branch failed:", err.response || err);
        const msg = err.response?.data?.message || "Failed to add branch";
        this.showSnackbar(msg, "error");
      } finally {
        this.loadingBranch = false;
      }
    },
    async deleteBranch(id) {
      try {
        await axios.delete(`/branches/${id}`);
        this.branches = this.branches.filter(b => b.id !== id);
        this.showSnackbar("Branch deleted", "error");
        if (this.newCourse.branch_id === id) {
          this.newCourse.branch_id = this.branches.length ? this.branches[0].id : null;
        }
      } catch (err) {
        console.error("Delete branch failed:", err);
        this.showSnackbar("Failed to delete branch", "error");
      }
    },

    /* ---------- Course Methods ---------- */
    async fetchCourses() {
      try {
        const res = await axios.get("/courses");
        this.courses = res.data.data || [];
      } catch (err) {
        console.error("Fetch courses failed:", err);
        this.showSnackbar("Failed to fetch courses", "error");
      }
    },
    async addCourse() {
      if (!this.newCourse.name || !this.newCourse.branch_id) return;
      this.loadingCourse = true;
      try {
        const res = await axios.post("/courses", this.newCourse);
        this.courses.push(res.data);
        this.showSnackbar(`Course "${res.data.name}" added`, "success");

        // Reset form, auto-select first branch
        this.newCourse = {
          name: "",
          title: "",
          description: "",
          branch_id: this.branches.length ? this.branches[0].id : null,
        };
        this.validCourse = false;
      } catch (err) {
        console.error("Add course failed:", err.response || err);
        const msg = err.response?.data?.message || "Failed to add course";
        this.showSnackbar(msg, "error");
      } finally {
        this.loadingCourse = false;
      }
    },
    async deleteCourse(id) {
      try {
        await axios.delete(`/courses/${id}`);
        this.courses = this.courses.filter(c => c.id !== id);
        this.showSnackbar("Course deleted", "error");
      } catch (err) {
        console.error("Delete course failed:", err);
        this.showSnackbar("Failed to delete course", "error");
      }
    },

    /* ---------- Snackbar ---------- */
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
