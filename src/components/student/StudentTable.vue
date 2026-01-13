<template>
  <v-card>
    <v-toolbar flat color="white">
      <v-toolbar-title>All Students List</v-toolbar-title>
      <v-spacer />
      <v-chip color="green darken-2" dark class="d-flex align-center px-3 py-1">
        <v-icon left small>mdi-account-group</v-icon>
        {{ totalStudents }} Students
      </v-chip>
    </v-toolbar>

    <v-divider />

    <v-data-table
      :headers="headers"
      :items="students"
      :items-per-page="itemsPerPage"
      hide-default-footer
      item-key="id"
    >
      <template slot="item.status" slot-scope="props">
        <v-chip
          small
          :color="props.item.status === 'complete' ? 'green' : 'orange'"
          dark
        >
          {{ props.item.status }}
        </v-chip>
      </template>

      <template slot="item.subjects" slot-scope="props">
        <v-chip
          v-for="(sub, i) in props.item.subjects"
          :key="i"
          small
          class="ma-1"
        >
          {{ sub }}
        </v-chip>
      </template>

      <template slot="item.action" slot-scope="props">
        <v-btn
          icon
          small
          color="blue"
          @click="$emit('edit-student', props.item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn icon small color="red" @click="confirmDelete(props.item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-divider />

    <v-card-actions class="justify-center">
      <v-pagination v-model="localPage" :length="pageCount" total-visible="7" />
    </v-card-actions>

    <v-dialog v-model="deleteDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete
          <strong>{{ studentToDelete?.name }}</strong
          >?
          <br />
          This action cannot be undone.
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" @click="deleteStudent">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "StudentTable",
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Phone", value: "phone" },
        { text: "Address", value: "address" },
        { text: "Branch", value: "branch" },
        { text: "Status", value: "status" },
        { text: "Action", value: "action", sortable: false },
      ],
      localPage: 1,
      itemsPerPage: 10,
      deleteDialog: false,
      studentToDelete: null,
    };
  },
  computed: {
    ...mapGetters(["paginatedStudents", "pageCount", "totalStudents"]),
    students() {
      return this.paginatedStudents;
    },
  },
  watch: {
    localPage(newPage) {
      this.SET_PAGE(newPage);
    },
    "$store.state.page": {
      immediate: true,
      handler(val) {
        this.localPage = val;
      },
    },
  },
  methods: {
    ...mapMutations(["SET_PAGE"]),
    ...mapActions(["fetchStudents", "deleteStudent"]),

    confirmDelete(student) {
      this.studentToDelete = student;
      this.deleteDialog = true;
    },

    async deleteStudentAPI() {
      if (!this.studentToDelete) return;
      await this.deleteStudent(this.studentToDelete.id);
      this.deleteDialog = false;
      this.studentToDelete = null;
      this.$nextTick(() => alert("Student deleted successfully!"));
    },
  },
  mounted() {
    this.fetchStudents(); // Fetch students on mount
  },
};
</script>


<style scoped>
.v-card {
  border-radius: 12px;
}
.v-card-actions .v-btn {
  text-transform: none;
}
</style>
