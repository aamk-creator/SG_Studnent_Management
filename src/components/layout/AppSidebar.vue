<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    app
    clipped permanent
  >
    <v-list dense nav>

      <v-list-item
        v-for="item in items"
        :key="item.page"
        link
        :class="{ 'grey lighten-3': selectedPage === item.page }"
        @click="select(item.page)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        
        <v-list-item-content v-if="!mini">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>

      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    value: Boolean,
    mini: Boolean,
    selectedPage: String
  },
  computed: {
    drawer: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    select (page) {
      this.$emit('select-page', page)
    }
  },
  data () {
    return {
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', page: 'Dashboard' },
        { title: 'Students', icon: 'mdi-account-group', page: 'ViewStudent' },
        { title: 'All Courses', icon: 'mdi-book-open', page: 'AllCourses' }
      ]
    }
  }
}
</script>
