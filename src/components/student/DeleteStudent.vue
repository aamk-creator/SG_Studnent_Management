<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <v-chip color="green" variant="flat">Students List</v-chip>

        <v-btn
          color="red"
          :disabled="selected.length === 0"
          @click="openConfirm"
        >
          Delete Selected ({{ selected.length }})
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="students"
        item-key="id"
        show-select
        v-model="selected"
      />
    </v-card>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>

        <v-card-text>
          Are you sure you want to delete
          <strong>{{ selected.length }}</strong> student(s)?
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="red" @click="confirmDelete">Yes, Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  name: "DeleteStudent",

  data() {
    return {
      selected: [],
      confirmDialog: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Course", value: "course.name" },
        { text: "Branch", value: "branch.name" }
      ]
    }
  },

  mounted() {

    this.fetchStudents()
  },

  computed: {
    ...mapState("students",{
      students: state=> state.students
    })
  },

  methods: {
    ...mapActions("students",["fetchStudents","deleteStudents"]),

    openConfirm() {
      this.confirmDialog = true
    },

    closeDialog() {
      this.confirmDialog = false
    },

    async confirmDelete() {
      const ids = this.selected.map(s => s.id)

      try {
        await this.deleteStudents(ids)

        this.snackbarText = `${ids.length} student(s) deleted successfully`
        this.snackbarColor = "success"
      } catch (e) {
        this.snackbarText = "Delete failed"
        this.snackbarColor = "error"
      }

      this.snackbar = true
      this.selected = []
      this.closeDialog()
    }
  }
}
</script>
