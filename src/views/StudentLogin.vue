<template>
  <v-container fluid class="fill-height d-flex justify-center align-center">
    <v-card class="mx-auto" max-width="400">
      <v-card-title class="headline justify-center">Student Login</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            label="Student Code"
            v-model="code"
            :rules="[v => !!v || 'Code is required']"
            outlined
            dense
          />
          <v-text-field
            label="Password"
            v-model="password"
            type="password"
            :rules="[v => !!v || 'Password is required']"
            outlined
            dense
          />
          <v-btn
            color="primary"
            block
            :disabled="!valid || loading"
            :loading="loading"
            class="mt-4"
            @click="login"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
        {{ snackbarText }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "StudentLogin",
  data() {
    return {
      code: "",
      password: "",
      valid: false,
      loading: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
    };
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        const res = await axios.post("/student/login", {
          code: this.code,
          password: this.password,
        });

        // Save token
        localStorage.setItem("student_token", res.data.token);

        // Redirect to Student Portal
        this.$router.push({ name: "StudentPortal" });
      } catch (err) {
        console.error(err);
        this.showSnackbar(
          err.response?.data?.message || "Login failed",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
    showSnackbar(msg, color = "error") {
      this.snackbarText = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
