<template>
  <v-container fluid>
    <v-card class="max-w-md mx-auto">
      <!-- Header -->
      <v-toolbar color="blue darken-2" dark flat>
        <v-toolbar-title>
          <v-icon class="mr-2">mdi-account-edit-outline</v-icon>
          Edit Student
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- Student Code -->
          <v-text-field
            label="Student Code"
            v-model="studentForm.code"
            :rules="[v => !!v || 'Required']"
            prepend-icon="mdi-identifier"
          />

          <!-- Student Name -->
          <v-text-field
            label="Student Name"
            v-model="studentForm.name"
            :rules="[v => !!v || 'Required']"
            prepend-icon="mdi-account"
          />

          <!-- Course -->
          <v-select
            label="Course"
            :items="courses"
            item-text="name"
            item-value="id"
            v-model="studentForm.course_id"
            :rules="[v => !!v || 'Required']"
            prepend-icon="mdi-book"
          />

          <!-- Branch -->
          <v-select
            label="Branch"
            :items="branches"
            item-text="name"
            item-value="id"
            v-model="studentForm.branch_id"
            :rules="[v => !!v || 'Required']"
            prepend-icon="mdi-source-branch"
          />

          <!-- Status -->
          <v-select
            label="Status"
            :items="['active', 'inactive']"
            v-model="studentForm.status"
            :rules="[v => !!v || 'Required']"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="$emit('close-dialog')">Cancel</v-btn>
        <v-btn
          color="blue darken-2"
          dark
          :loading="loading"
          :disabled="!valid || loading"
          @click="submitForm"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "EditStudent",

  props: {
    student: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      valid: false,
      loading: false,
      studentForm: {
        id: this.student.id || null,
        code: this.student.code || "",
        name: this.student.name || "",
        course_id: this.student.course ? this.student.course.id : null,
        branch_id: this.student.branch ? this.student.branch.id : null,
        status: this.student.status || "active",
      },
      courses: [],
      branches: [],
    };
  },

  watch: {
    student(newVal) {
      this.studentForm = {
        id: newVal.id || null,
        code: newVal.code || "",
        name: newVal.name || "",
        course_id: newVal.course ? newVal.course.id : null,
        branch_id: newVal.branch ? newVal.branch.id : null,
        status: newVal.status || "active",
      };
    },
  },

  methods: {
    ...mapActions("students", ["updateStudent"]),

    async fetchCourses() {
      try {
        const res = await axios.get("/courses");
        this.courses = res.data.data || [];
      } catch (err) {
        console.error("Fetch courses failed", err);
      }
    },

    async fetchBranches() {
      try {
        const res = await axios.get("/branches");
        this.branches = res.data.data || [];
      } catch (err) {
        console.error("Fetch branches failed", err);
      }
    },

    async submitForm() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;
      try {
        // Update the student in Vuex and backend
        await this.updateStudent(this.studentForm);

        // Notify parent to refresh table
        this.$emit("student-updated");
        this.$emit("close-dialog");
      } catch (err) {
        console.error("Edit student failed:", err.response || err);
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.fetchCourses();
    this.fetchBranches();
  },
};
</script>
