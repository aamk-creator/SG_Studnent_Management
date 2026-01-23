<template>
  <v-container fluid class="login-bg">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="4">
        <v-card class="login-card" elevation="12">
          <v-card-text>

            <!-- Lock icon -->
            <div class="text-center mb-6">
              <v-icon size="48" color="green darken-1">mdi-lock</v-icon>
            </div>

            <!-- Email -->
            <v-text-field
              v-model="email"
              label="Email"
              prepend-inner-icon="mdi-account"
              color="green"
              dense
              outlined
              hide-details
            />

            <!-- Password -->
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              color="green"
              dense
              outlined
              hide-details
              class="mt-4"
            />

            <!-- Error -->
            <v-alert
              v-if="error"
              type="error"
              dense
              text
              class="mt-3"
            >
              {{ error }}
            </v-alert>

            <!-- Login button -->
            <v-btn
              block
              large
              color="light-green darken-1"
              class="mt-6 white--text"
              :loading="loading"
              @click="submitLogin"
            >
              LOGIN
            </v-btn>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  computed: {
    ...mapState(["loading", "error"]),
  },
  methods: {
    ...mapActions(["login"]),

   async submitLogin() {
  if (!this.email || !this.password) return;

  const success = await this.login({
    email: this.email,
    password: this.password,
  });

  if (success) {
    this.$emit("login-success");
  }
}

  },
};
</script>

<style scoped>
.login-bg {
  background-color: #eaf6ff;
}

.login-card {
  border-radius: 8px;
  padding: 16px;
}
</style>
