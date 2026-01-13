<template>
  <v-pagination
    v-model="page"
    :length="5"
    class="mt-4"
  />
</template>

<script>
export default {
  computed: {
    page: {
      get() {
        return this.$store.state.students.page
      },
      set(val) {
        this.$store.commit('students/SET_PAGE', val)
      }
    }
  }
}
</script>
