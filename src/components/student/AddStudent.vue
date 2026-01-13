<template>
  <v-container fluid>
    <v-card>
      <v-toolbar flat color="green-darken-2" dark rounded class="max-w-md mx-auto">
        <v-toolbar-title>
          <v-icon start>mdi-account-plus-outline</v-icon>
          Add New Student
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-col cols="12" class="py-2">
            <v-text-field
              v-model="student.name"
              label="STUDENT NAME"
              prepend-inner-icon="mdi-format-letter-case"
              :rules="[v => !!v || 'Required']"
              density="compact"
              variant="underlined"
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-2">
            <v-text-field
              v-model="student.phone"
              label="PHONE NUMBER"
              prepend-inner-icon="mdi-phone"
              :rules="[v => !!v || 'Required']"
              density="compact"
              variant="underlined"
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-2">
            <v-text-field
              v-model="student.address"
              label="ADDRESS"
              prepend-inner-icon="mdi-map-marker-outline"
              density="compact"
              variant="underlined"
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-2">
            <v-text-field
              v-model="student.branch"
              label="BRANCH NAME"
              prepend-inner-icon="mdi-source-branch"
              density="compact"
              variant="underlined"
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-2">
            <v-select
              v-model="student.subjects"
              :items="availableSubjects"
              label="SUBJECTS"
              prepend-inner-icon="mdi-book-open-page-variant"
              multiple
              chips
              density="compact"
              variant="underlined"
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-2">
            <v-select
              v-model="student.status"
              :items="['pending', 'complete']"
              label="STATUS"
              prepend-inner-icon="mdi-flag"
              density="compact"
              variant="underlined"
              class="line-input"
            />
          </v-col>
        </v-form>
      </v-card-text>

      <v-divider class="my-4" />

      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" rounded color="grey-darken-1" @click="resetForm">
          Cancel
        </v-btn>
        <v-btn
          variant="outlined"
          rounded
          color="green-darken-2"
          :disabled="!valid || loading"
          :loading="loading"
          @click="submitForm"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AddStudent",
  data() {
    return {
      valid: false,
      loading: false, // Added loading state for button feedback
      student: {
        name: "",
        phone: "",
        address: "",
        branch: "",
        subjects: [],
        status: "pending",
      },
      availableSubjects: [
        "Programming Fundamentals",
        "Data Structures",
        "Algorithms",
        "Database Systems",
        "Computer Networks",
        "Operating Systems",
      ],
    };
  },
  methods: {
    ...mapActions(["addStudent"]),

    async submitForm() {
 
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;
      try {
     
        await this.addStudent({ ...this.student });
   
        this.resetForm();
      } catch (error) {
        console.error("Submission failed:", error);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.student = {
        name: "",
        phone: "",
        address: "",
        branch: "",
        subjects: [],
        status: "pending",
      };
      if (this.$refs.form) this.$refs.form.resetValidation();
      this.$emit("close-dialog", false);
    },
  },
};
</script>
