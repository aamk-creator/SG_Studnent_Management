<template>
  <v-pagination
    v-model="page"
    :length="pageCount"
    class="mt-4"
  />
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "StudentPagination",

  computed: {
    ...mapGetters("students", ["pageCount"]),

    page: {
      get() {
        return this.$store.state.students.page;
      },
      set(val) {
        this.$store.commit("students/SET_PAGE", val);
        this.fetchStudents(); // fetch students for the new page
      },
    },
  },

  methods: {
    ...mapActions("students", ["fetchStudents"]),
  },
};
</script>
