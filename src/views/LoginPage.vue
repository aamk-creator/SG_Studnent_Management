<template>
  <v-container fluid class="fill-height d-flex justify-center align-center">
    <v-card max-width="400" class="mx-auto">
      <v-card-title class="headline justify-center">Student Login</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            label="Student Code"
            v-model="code"
            :rules="[v => !!v || 'Code is required']"
            outlined dense
          />
          <v-text-field
            label="Password"
            v-model="password"
            type="password"
            :rules="[v => !!v || 'Password is required']"
            outlined dense
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
export default {
  name: "StudentLoginTest",
  data() {
    return {
      code: "",
      password: "",
      valid: false,
      loading: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "error",
    };
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        const res = await this.$axios.post("/student/login", {
          code: this.code,
          password: this.password,
        });

        // Save student token
        localStorage.setItem("student_token", res.data.token);

        // Optional: show success message
        this.snackbarText = "Login successful!";
        this.snackbarColor = "success";
        this.snackbar = true;

        // Save student info in store
        this.$store.commit("auth/setUser", { ...res.data.student, role: "student" });

        // Notify parent App.vue if needed
        this.$emit("login-success");

        console.log("Student logged in:", res.data.student);

      } catch (err) {
        console.error(err);
        this.snackbarText = err.response?.data?.message || "Login failed";
        this.snackbarColor = "error";
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
