<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    app
    clipped
    permanent
    flat
    class="border-right grey lighten-5"
    width="260"
  >
    <v-list nav class="py-4 px-3">
      <v-list-item
        v-for="item in items"
        :key="item.page"
        link
        :ripple="false"
        class="rounded-xl mb-2 transition-swing nav-item"
        :class="{ 'active-item': selectedPage === item.page }"
        @click="select(item.page)"
      >
        <v-list-item-icon class="mr-4">
          <v-icon
            :color="selectedPage === item.page ? 'green darken-2' : 'blue-grey lighten-1'"
          >
            {{ item.icon }}
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold"
            :class="selectedPage === item.page ? 'green--text text--darken-3' : 'blue-grey--text text--darken-1'"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action v-if="selectedPage === item.page && !mini">
          <v-badge dot color="green darken-1" />
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <template v-slot:append v-if="!mini">
      <div class="pa-4">
        <v-card flat color="green lighten-5" class="rounded-xl pa-4">
          <div class="caption font-weight-black green--text text--darken-3 mb-1">SYSTEM STATUS</div>
          <div class="d-flex align-center">
            <v-icon x-small color="green" class="mr-2">mdi-circle</v-icon>
            <span class="caption grey--text text--darken-1">Online</span>
          </div>
        </v-card>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "AppSidebar",
  props: {
    value: Boolean,
    mini: Boolean,
    selectedPage: String,
  },
  computed: {
    drawer: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    select(page) {
      this.$emit("select-page", page);
    },
  },
  data() {
    return {
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard-outline", page: "Dashboard" },
        { title: "Students", icon: "mdi-account-group-outline", page: "ViewStudent" },
        { title: "All Courses", icon: "mdi-book-open-variant", page: "AllCourses" },
      ],
    };
  },
};
</script>

<style scoped>
.border-right {
  border-right: 1px solid #edf2f7 !important;
}
.active-item {
  background-color: #e8f5e9 !important;
  box-shadow: 0 4px 6px -1 rgba(0, 0, 0, 0.05),
              0 2px 4px -1 rgba(0, 0, 0, 0.03) !important;
}
.nav-item {
  transition: all 0.2s ease-in-out;
}
.nav-item:hover:not(.active-item) {
  background-color: #f1f5f9;
}
.v-list-item--link:before {
  background-color: transparent !important;
}
</style>
