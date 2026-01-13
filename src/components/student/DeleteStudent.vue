<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <v-chip color="green" variant="flat"> Students List </v-chip>

        <v-btn
          color="red darken-1"
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

    <v-dialog
      v-model="confirmDialog"
      max-width="420"
      scrollable
      @click:outside="closeDialog"
    >
      <v-card>
        <v-card-title class="headline"> Confirm Delete </v-card-title>

        <v-card-text>
          Are you sure you want to delete
          <strong>{{ selected.length }}</strong> student(s)?
          <br />
          This action cannot be undone.
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog"> Cancel </v-btn>

          <v-btn color="red darken-1" @click="confirmDelete">
            Yes, Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

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
        { text: "Phone", value: "phone" },
        { text: "Branch", value: "branch" },
      ],
    };
  },
  computed: {
    ...mapState(["students"]),
  },
  methods: {
    ...mapMutations(["DELETE_STUDENTS"]),

    openConfirm() {
      if (this.selected.length === 0) return;
      this.confirmDialog = true;
    },

    closeDialog() {
      this.confirmDialog = false;
    },

    confirmDelete() {
      const ids = this.selected.map((s) => s.id);
      if (!ids.length) return;

      this.DELETE_STUDENTS(ids);

      this.snackbarText = `${ids.length} student(s) deleted successfully.`;
      this.snackbarColor = "success";
      this.snackbar = true;

      this.selected = [];
      this.closeDialog();

      this.$emit("close-dialog");
    },
  },
};
</script>
