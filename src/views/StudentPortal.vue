<template>
  <v-container fluid>
    <v-card class="mb-6">
      <v-card-title>
        <v-icon left color="primary">mdi-account-school</v-icon>
        Student Portal
      </v-card-title>
    </v-card>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <!-- Student Info -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Student Information</v-card-title>
          <v-card-text>
            <p><strong>Name:</strong> {{ student.name }}</p>
            <p><strong>Student Code:</strong> {{ student.code }}</p>
            <p><strong>Status:</strong> {{ student.status }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Course Info -->
      <v-col cols="12" md="6" v-if="student.course">
        <v-card>
          <v-card-title>Course Information</v-card-title>
          <v-card-text>
            <p><strong>Course:</strong> {{ student.course.name }}</p>
            <p><strong>Start Date:</strong> {{ formatDate(student.course_start_at) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(student.course_end_at) }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Certificate -->
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Certificate
            <v-spacer />
            <v-chip
              :color="student.certificate_issued_at ? 'green' : 'grey'"
              dark
            >
              {{ student.certificate_issued_at ? 'Issued' : 'Not Issued' }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <p v-if="student.certificate_issued_at">
              <strong>Issued At:</strong> {{ formatDate(student.certificate_issued_at) }}
            </p>

            <v-btn
              v-if="student.certificate_issued_at"
              color="primary"
              @click="downloadCertificate"
            >
              <v-icon left>mdi-download</v-icon>
              Download Certificate (PDF)
            </v-btn>

            <v-btn
              v-else
              color="orange"
              disabled
            >
              Certificate Not Issued Yet
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "StudentPortal",
  data() {
    return {
      student: {},
      loading: true,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
    };
  },
  methods: {
    async fetchStudent() {
      try {
        const res = await axios.get("/student/me"); // endpoint to get current student
        this.student = res.data.data;
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to fetch student data", "error");
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : "-";
    },
    async downloadCertificate() {
      try {
        const res = await axios.get("/student/certificate/download", {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `certificate_${this.student.code}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to download certificate", "error");
      }
    },
    showSnackbar(message, color = "success") {
      this.snackbarText = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
  mounted() {
    this.fetchStudent();
  },
};
</script>
