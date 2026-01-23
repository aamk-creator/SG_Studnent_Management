<template>
  <v-app-bar app color="green" dark clipped-left>
    <v-btn icon @click="$emit('toggle-drawer')">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-toolbar-title class="ml-2"> Student Management System </v-toolbar-title>

    <v-spacer />

    <v-text-field
      dense
      solo-inverted
      flat
      hide-details
      placeholder="Search student..."
      prepend-inner-icon="mdi-magnify"
      class="mr-4 d-none d-md-flex"
      style="max-width: 220px"
      v-model="search"
      @input="onSearch"
    />

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-earth</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item @click="changeLang('en')">
          <v-list-item-title>English</v-list-item-title>
        </v-list-item>

        <v-list-item @click="changeLang('mm')">
          <v-list-item-title>မြန်မာ</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar size="32" color="white" v-bind="attrs" v-on="on" class="ml-2">
          <span class="green--text font-weight-bold">
            {{ adminInitial }}
          </span>
        </v-avatar>
      </template>

      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ admin.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ admin.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list-item @click="openProfile">
          <v-list-item-icon>
            <v-icon x-small color="primary"
              >mdi-account</v-icon
            ></v-list-item-icon
          >
          <v-list-item-title>Edit Profile</v-list-item-title>
        </v-list-item>

        <v-list-item @click="Pagelogout">
          <v-list-item-icon>
            <v-icon color="red">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "AppTopbar",
  data() {
    return {
      admin: {
        name: "Admin User",
        email: "admin@gmail.com",
      },
    };
  },
  computed: {
    adminInitial() {
      return this.admin.name.charAt(0).toUpperCase();
    },
  },

  methods: {
    onSearch(val) {
      this.$store.commit("SET_SEARCH", val);
    },

    ...mapActions(["logout"]),

    changeLang(lang) {
      console.log("Language changed to:", lang);
      // integrate vue-i18n here later
    },
    openProfile() {
      alert("Open admin profile");
    },

    Pagelogout() {
      // alert("Logging out...");
      this.logout();
    },
  }, 
};
</script>
