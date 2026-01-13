<template>
  <v-footer padless>
    <v-card
      flat
      tile
      class="footer-card d-flex align-center justify-center"
    >
      <span>
        © {{ year }} Student Management System
      </span>

      <v-chip
        small
        class="ml-3"
        color="green darken-1"
        text-color="white"
      >
        version 1.1.1.1
      </v-chip>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data () {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.footer-card {
  width: 100%;
  height: 42px;
  background-color: #f1f8f4;
  font-size: 13px;
}
</style>
