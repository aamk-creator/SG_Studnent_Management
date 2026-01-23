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
            :rules="[v => !!v || 'Required']"
            prepend-icon="mdi-identifier"
          />

          <!-- Student Name -->
          <v-text-field
            label="Student Name"
            v-model="student.name"
            :rules="[v => !!v || 'Required']"
            prepend-icon="mdi-account"
          />

          <!-- Course -->
          <v-select
            label="Course"
            :items="courses"
            item-text="name"
            item-value="id"
            v-model="student.course_id"
            :rules="[v => !!v || 'Required']"
            prepend-icon="mdi-book"
          />

          <!-- Branch -->
          <v-select
            label="Branch"
            :items="branches"
            item-text="name"
            item-value="id"
            v-model="student.branch_id"
            :rules="[v => !!v || 'Required']"
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
import axios from "axios";
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
        course_id: null,
        branch_id: null,
      },
      courses: [],
      branches: [],
    };
  },

  methods: {
    
    ...mapActions("students", ["addStudent"]),

    async fetchCourses() {
      try {
        const res = await axios.get("/courses");
        this.courses = res.data.data || [];
      } catch (err) {
        console.error("Fetch courses failed:", err);
      }
    },

    async fetchBranches() {
      try {
        const res = await axios.get("/branches");
        this.branches = res.data.data || [];
      } catch (err) {
        console.error("Fetch branches failed:", err);
      }
    },

    async submitForm() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;
      try {
        //AUTO table update)
        await this.addStudent({
          ...this.student,
          user_id: 1, // temp admin user
        });

        // Close dialog & reset
        this.closeDialog();
        this.resetForm();
      } catch (err) {
        console.error("Add student failed:", err);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.student = {
        code: "",
        name: "",
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
