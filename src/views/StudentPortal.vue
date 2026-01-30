<template>
  <v-container fluid>
    <!-- Student Info -->
    <v-card class="mb-6">
      <v-card-title>
        <v-icon left color="primary">mdi-account-school</v-icon>
        Student Information
      </v-card-title>
      <v-card-text v-if="student">
        <p><strong>Name:</strong> {{ student.name }}</p>
        <p><strong>Code:</strong> {{ student.code }}</p>
        <p><strong>Status:</strong> {{ student.status }}</p>
      </v-card-text>
      <v-card-text v-else>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-card-text>
    </v-card>

    <!-- Course Info -->
    <v-card class="mb-6" v-if="student?.course">
      <v-card-title>Course Information</v-card-title>
      <v-card-text>
        <p><strong>Course:</strong> {{ student.course.name }}</p>
        <p><strong>Start:</strong> {{ formatDate(student.course_start_at) }}</p>
        <p><strong>End:</strong> {{ formatDate(student.course_end_at) }}</p>
      </v-card-text>
    </v-card>

    <!-- Certificate -->
    <v-card class="mb-6">
      <v-card-title>
        Certificate
        <v-spacer />
        <v-chip
          :color="student?.certificate_issued_at ? 'green' : 'grey'"
          dark
        >
          {{ student?.certificate_issued_at ? 'Issued' : 'Not Issued' }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <p v-if="student?.certificate_issued_at">
          <strong>Issued At:</strong> {{ formatDate(student.certificate_issued_at) }}
        </p>
        <v-btn
          v-if="student?.certificate_issued_at"
          color="primary"
          @click="downloadCertificate"
        >
          <v-icon left>mdi-download</v-icon> Download PDF
        </v-btn>
        <v-btn v-else color="orange" disabled>Certificate Not Issued Yet</v-btn>
      </v-card-text>
    </v-card>

    <!-- Change Password -->
    <v-card class="mb-6">
      <v-card-title>Change Password</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            label="Current Password"
            v-model="currentPassword"
            type="password"
            outlined dense
          />
          <v-text-field
            label="New Password"
            v-model="newPassword"
            type="password"
            outlined dense
          />
          <v-text-field
            label="Confirm New Password"
            v-model="confirmPassword"
            type="password"
            outlined dense
          />
          <v-btn
            color="primary"
            class="mt-4"
            :loading="loading"
            :disabled="!valid"
            @click="changePassword"
          >
            Change Password
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "StudentPortal",
  data() {
    return {
      student: null,
      loading: true,
      valid: true,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
    };
  },
  methods: {
    async fetchStudent() {
      this.loading = true;
      try {
        const res = await this.$axios.get("/student/me");
        this.student = res.data.data;
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to fetch student info", "error");
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : "-";
    },
    async downloadCertificate() {
      try {
        const res = await this.$axios.get("/student/certificate/download", { responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `certificate_${this.student.code}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to download certificate", "error");
      }
    },
    async changePassword() {
      if (!this.newPassword || !this.currentPassword || !this.confirmPassword) {
        this.showSnackbar("Please fill all password fields", "error");
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.showSnackbar("New passwords do not match", "error");
        return;
      }
      this.loading = true;
      try {
        const res = await this.$axios.post("/student/change-password", {
          current_password: this.currentPassword,
          new_password: this.newPassword,
          new_password_confirmation: this.confirmPassword,
        });
        this.showSnackbar(res.data.message, "success");
        this.currentPassword = this.newPassword = this.confirmPassword = "";
      } catch (err) {
        console.error(err);
        this.showSnackbar(err.response?.data?.message || "Password change failed", "error");
      } finally {
        this.loading = false;
      }
    },
    showSnackbar(msg, color = "success") {
      this.snackbarText = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
  mounted() {
    this.fetchStudent();
  },
};
</script>
