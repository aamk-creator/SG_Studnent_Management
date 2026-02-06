<template>
  <v-app-bar app flat clipped-left color="white" class="border-bottom px-2" height="70">
    <!-- Drawer Toggle -->
    <v-btn icon class="light-green lighten-5 mr-2" @click="$emit('toggle-drawer')">
      <v-icon color="light-green darken-2">mdi-shuffle-variant</v-icon>
    </v-btn>

    <!-- Title -->
    <v-toolbar-title class="d-none d-sm-flex pl-0">
      <span class="text-h6 font-weight-black tracking-tight">
        <span class="green--text text--darken-1">Student Management System</span>
      </span>
    </v-toolbar-title>

    <v-spacer />

    <!-- Search -->
    <v-text-field
      v-model="search"
      dense
      flat
      solo
      hide-details
      placeholder="Search records..."
      append-icon="mdi-magnify"
      background-color="grey lighten-5"
      class="rounded-pill d-none d-md-flex search-bar px-4"
      style="max-width: 400px"
      @input="onSearch"
    />

    <v-spacer />

    <div class="d-flex align-center">
      <!-- Language -->
      <v-btn text class="rounded-pill px-3 mr-2 grey--text text--darken-2 font-weight-bold" @click="changeLang('en')">
        <v-icon left size="20" color="light-green darken-1">mdi-translate</v-icon> EN
      </v-btn>

      <!-- Profile Menu -->
      <v-menu offset-y transition="slide-y-transition" rounded="xl" min-width="240">
        <template v-slot:activator="{ on, attrs }">
          <v-card
            flat
            color="light-green lighten-5"
            class="rounded-pill pl-1 pr-3 py-1 d-flex align-center cursor-pointer profile-trigger"
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar size="32" color="light-green darken-1">
              <span class="white--text font-weight-black body-2">{{ adminInitial }}</span>
            </v-avatar>
            <span class="ml-2 d-none d-lg-inline font-weight-bold light-green--text text--darken-3">
              {{ admin.name || 'Admin' }}
            </span>
            <v-icon right x-small color="light-green darken-2">mdi-chevron-down</v-icon>
          </v-card>
        </template>

        <v-card class="pa-2 border-0 shadow-lg">
          <v-list flat>
            <v-list-item class="px-2">
              <v-list-item-avatar color="light-green lighten-5">
                <span class="light-green--text text--darken-2 font-weight-bold">{{ adminInitial }}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-black">{{ admin.name || 'Admin User' }}</v-list-item-title>
                <v-list-item-subtitle class="caption">{{ admin.email || 'admin@example.com' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider class="mx-2 mb-2" />

          <v-list dense flat>
            <!-- Edit Profile -->
            <v-list-item @click="openProfile" class="rounded-lg">
              <v-list-item-icon class="mr-3">
                <v-icon color="light-green darken-1">mdi-account-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Edit Profile</v-list-item-title>
            </v-list-item>

            <!-- Logout -->
            <v-list-item @click="Pagelogout" class="rounded-lg red--text">
              <v-list-item-icon class="mr-3">
                <v-icon color="red">mdi-logout-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="font-weight-bold">Logout</v-list-item-title>
            </v-list-item>

            <!-- Add Admin -->
            <v-list-item @click="addAdminDialog = true" class="rounded-lg blue--text">
              <v-list-item-icon class="mr-3">
                <v-icon color="blue">mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Add Admin</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <!-- Add Admin Dialog -->
    <v-dialog v-model="addAdminDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Add New Admin</v-card-title>
        <v-card-text>
          <v-text-field v-model="newAdmin.name" label="Name" />
          <v-text-field v-model="newAdmin.email" label="Email" />
          <v-text-field v-model="newAdmin.password" label="Password" type="password" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey darken-1" @click="addAdminDialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="createAdmin">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Profile Dialog -->
    <v-dialog v-model="editProfileDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Edit Profile</v-card-title>
        <v-card-text>
          <v-text-field v-model="editProfileForm.name" label="Name" />
          <v-text-field v-model="editProfileForm.email" label="Email" />
          <v-text-field v-model="editProfileForm.password" label="New Password" type="password" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey darken-1" @click="editProfileDialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="updateProfile">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for alerts -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      top
      right
      timeout="3000"
    >
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from "vuex";
import axios from "@/plugins/axios";

export default {
  name: "AppTopbar",
  data() {
    return {
      search: "",
      addAdminDialog: false,
      newAdmin: { name: "", email: "", password: "" },

      editProfileDialog: false,
      editProfileForm: { name: "", email: "", password: "" },

      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "success",
    };
  },
  computed: {
    ...mapState({ admin: (state) => state.user || {} }),
    adminInitial() {
      return this.admin.name ? this.admin.name.charAt(0).toUpperCase() : "A";
    },
  },
  methods: {
    ...mapActions(["logout"]),
    onSearch(val) { this.$store.commit("SET_SEARCH", val); },
    changeLang(lang) { console.log("Language changed to:", lang); },
    Pagelogout() { this.logout(); },

    openProfile() {
      this.editProfileForm = {
        name: this.admin.name || "",
        email: this.admin.email || "",
        password: "",
      };
      this.editProfileDialog = true;
    },

    async updateProfile() {
      try {
        const payload = {
          name: this.editProfileForm.name,
          email: this.editProfileForm.email,
        };
        if (this.editProfileForm.password) payload.password = this.editProfileForm.password;

        const res = await axios.put("/me", payload);

        // Snackbar for success
        this.snackbarMessage = res.data.message || "Profile updated successfully!";
        this.snackbarColor = "success";
        this.snackbar = true;

        this.editProfileDialog = false;
        this.$store.commit("SET_USER", res.data.data);
      } catch (err) {
        console.error(err);
        this.snackbarMessage = err.response?.data?.message || "Failed to update profile";
        this.snackbarColor = "error";
        this.snackbar = true;
      }
    },

    async createAdmin() {
      try {
        const res = await axios.post("/users", this.newAdmin);

        this.snackbarMessage = res.data.message || "Admin created successfully!";
        this.snackbarColor = "success";
        this.snackbar = true;

        this.addAdminDialog = false;
      } catch (err) {
        console.error(err);
        this.snackbarMessage = err.response?.data?.message || "Failed to create admin";
        this.snackbarColor = "error";
        this.snackbar = true;
      }
    },

    async fetchUser() {
      try {
        const res = await axios.get("/me");
        this.$store.commit("SET_USER", res.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    },
  },
  created() {
    if (!this.admin.name) this.fetchUser();
  },
};
</script>

<style scoped>
.border-bottom { border-bottom: 1px solid #edf2f7 !important; }
.tracking-tight { letter-spacing: -1px !important; }
.search-bar { border: 1px solid #e2e8f0 !important; transition: all 0.3s ease; }
.search-bar:focus-within { border-color: #8bc34a !important; background-color: white !important; box-shadow: 0 4px 12px rgba(139, 195, 74, 0.1) !important; }
.search-bar >>> .v-icon { transition: color 0.3s ease; }
.search-bar:focus-within >>> .v-icon { color: #8bc34a !important; }
.profile-trigger { border: 1px solid transparent; transition: all 0.2s; }
.profile-trigger:hover { background-color: #f1f8e9 !important; border-color: #dcedc8; }
.cursor-pointer { cursor: pointer; }
</style>
