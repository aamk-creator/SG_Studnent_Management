<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height d-flex align-center justify-center">
        <v-card class="pa-6 elevation-5 rounded-lg" max-width="400px" color="green lighten-5">
          <v-card-title class="justify-center">
            <v-icon large color="green darken-2" class="mr-2">mdi-account-circle</v-icon>
            <span class="text-h5" style="color: #1b5e20">Login</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="email"
                label="Add Email"
                outlined
                dense
                color="green"
                :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'E-mail must be valid']"
              />
              <p> Hello </p>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                outlined
                dense
                color="green"
                :rules="[v => !!v || 'Password is required']"
              />

              <v-alert v-if="error" type="error" dense outlined class="mt-2">
                {{ error }}
              </v-alert>
            </v-form>
          </v-card-text>

          <v-card-actions class="px-4 pt-0">
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-2"
              dark
              rounded
              block
              @click="submitLogin"
              :loading="loading"
              :disabled="!valid"
            >
              Login
            </v-btn>
          </v-card-actions>

          <v-card-text class="text-center mt-3" style="color: #2e7d32">
            <small>Forgot your password? <a href="#" style="color: #1b5e20">Reset here</a></small>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      valid: false,
    };
  },
  computed: {
    ...mapState(["loading", "error"]),
  },
 methods: {
  ...mapActions(["login"]),
  async submitLogin() {
        console.log("username1",email)
    console.log("password1",password)
    if (!this.$refs.form.validate()) return;

    console.log("username",email)
    console.log("password",password)


   // await this.login({ email: this.email, password: this.password });

    // Check Vuex state for errors
    if (!this.$store.state.error) {
      // Redirect to dashboard
      this.$router.push("/dashboard");
    }
  },
},
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
.v-card-title .v-icon {
  font-size: 36px;
}
}
</style>
