<template>
  <v-container fluid>
    <v-card>
      <v-toolbar flat color="green" dark rounded class="max-w-md mx-auto">
        <v-toolbar-title>
          <v-icon left>mdi-pencil</v-icon>
          Edit Student Info
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-col cols="12" class="py-3 small-text">
            <v-text-field
              v-model="studentData.name"
              label="Student Name"
              prepend-inner-icon="mdi-format-letter-case"
              :rules="[(v) => !!v || 'Required']"
              dense
              hide-details
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-3 small-text">
            <v-text-field
              v-model="studentData.phone"
              label="Phone Number"
              prepend-inner-icon="mdi-phone"
              :rules="[(v) => !!v || 'Required']"
              dense
              hide-details
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-3 small-text">
            <v-text-field
              v-model="studentData.address"
              label="Address"
              prepend-inner-icon="mdi-map-marker-outline"
              dense
              hide-details
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-3 small-text">
            <v-text-field
              v-model="studentData.branch"
              label="Branch Name"
              prepend-inner-icon="mdi-source-branch"
              dense
              hide-details
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-3 small-text">
            <v-select
              v-model="studentData.subjects"
              :items="availableSubjects"
              label="Subjects"
              prepend-inner-icon="mdi-book-open-page-variant"
              multiple
              chips
              dense
              hide-details
              class="line-input"
            />
          </v-col>

          <v-col cols="12" class="py-3 small-text">
            <v-select
              v-model="studentData.status"
              :items="['pending', 'complete']"
              label="Status"
              prepend-inner-icon="mdi-flag"
              dense
              hide-details
              class="line-input"
            />
          </v-col>
        </v-form>
      </v-card-text>

      <v-divider class="my-4" />

      <v-card-actions>
        <v-spacer />
        <v-btn outlined rounded color="grey darken-1" @click="closeDialog">
          Cancel
        </v-btn>

        <v-btn
          outlined
          rounded
          color="blue darken-2"
          :disabled="!valid"
          @click="updateStudent"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";

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
      studentData: { ...this.student },
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
    ...mapMutations(["UPDATE_STUDENT"]), //add mutations to store

    closeDialog() {
      this.$emit("close-dialog", false);
    },

    updateStudent() {
      if (!this.$refs.form.validate()) return;

      this.UPDATE_STUDENT(this.studentData);

      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.line-input .v-input__control {
  background: transparent;
}

.line-input .v-input__slot::before {
  border-bottom: 1px solid #bdbdbd;
}

.line-input.v-input--has-state .v-input__slot::after {
  border-bottom: 2px solid #2196f3;
}

.line-input .v-label {
  font-size: 12px;
  letter-spacing: 1px;
  color: #9e9e9e;
}

.line-input .v-icon {
  color: #2196f3;
}

.small-text .v-label,
.small-text .v-input__slot {
  font-size: 0.8rem;
}

.v-col.py-3 {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
</style>
