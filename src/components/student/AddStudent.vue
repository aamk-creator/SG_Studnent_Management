<template>
  <v-container fluid>
    <v-card class="max-w-md mx-auto">
      <!-- Header -->
      <v-toolbar color="green darken-2" dark flat>
        <v-toolbar-title>
          <v-icon class="mr-2">mdi-account-plus-outline</v-icon>
          Add New Student
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- Student Code -->
          <v-text-field
            label="Student Code"
            v-model="student.code"
            :rules="[(v) => !!v || 'Required']"
            prepend-icon="mdi-identifier"
          />

          <!-- Student Name -->
          <v-text-field
            label="Student Name"
            v-model="student.name"
            :rules="[(v) => !!v || 'Required']"
            prepend-icon="mdi-account"
          />

          <!-- Email -->
          <v-text-field
            label="Email"
            v-model="student.email"
            :rules="[
              (v) => !!v || 'Required',
              (v) => /.+@.+\..+/.test(v) || 'Email must be valid'
            ]"
            prepend-icon="mdi-email"
          />

          <!-- Phone -->
          <v-text-field
            label="Phone"
            v-model="student.phone"
            :rules="[(v) => !!v || 'Required']"
            prepend-icon="mdi-phone"
          />

          <!-- Password -->
          <v-text-field
            label="Password"
            v-model="student.password"
            :rules="[
              (v) => !!v || 'Required',
              (v) => v.length >= 6 || 'Password must be at least 6 characters'
            ]"
            prepend-icon="mdi-lock"
            type="password"
          />

          <!-- Course -->
          <v-select
            label="Course"
            :items="courses"
            item-text="name"
            item-value="id"
            v-model="student.course_id"
            :rules="[(v) => !!v || 'Required']"
            prepend-icon="mdi-book"
          />

          <!-- Branch -->
          <v-select
            label="Branch"
            :items="branches"
            item-text="name"
            item-value="id"
            v-model="student.branch_id"
            :rules="[(v) => !!v || 'Required']"
            prepend-icon="mdi-source-branch"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="green darken-2"
          dark
          :loading="loading"
          :disabled="!valid || loading"
          @click="submitForm"
        >
          Add Student
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios";
import { mapActions } from "vuex";

export default {
  name: "AddStudent",
  data() {
    return {
      valid: false,
      loading: false,
      student: {
        code: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        course_id: null,
        branch_id: null,
      },
      courses: [],
      branches: [],
    };
  },
  methods: {
    ...mapActions("students", ["addStudent"]),

    // Fetch courses from API
    async fetchCourses() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.courses = res.data.data || [];
      } catch (err) {
        console.error("Fetch courses failed:", err);
      }
    },

    // Fetch branches from API
    async fetchBranches() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/branches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.branches = res.data.data || [];
      } catch (err) {
        console.error("Fetch branches failed:", err);
      }
    },

    // Submit form
    async submitForm() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;
      try {
        // Get admin id from localStorage (replace with your auth logic if different)
        const currentUser = JSON.parse(localStorage.getItem("user")) || {};

        const payloadToSend = {
          ...this.student,
          user_id: currentUser.id || 1, // default to 1 if not found
        };

        await this.addStudent(payloadToSend);

        this.resetForm();
        this.closeDialog();
        this.$emit("student-added");
      } catch (err) {
        console.error("Add student failed:", err.response?.data || err);
        alert(err.response?.data?.message || "Failed to add student");
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.student = {
        code: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        course_id: null,
        branch_id: null,
      };
      this.$refs.form.resetValidation();
    },

    closeDialog() {
      this.$emit("close-dialog");
    },
  },
  mounted() {
    this.fetchCourses();
    this.fetchBranches();
  },
};
</script>
