<template>
  <v-card>
    <!-- Header -->
    <v-toolbar flat color="white">
      <v-toolbar-title>All Students List</v-toolbar-title>
      <v-spacer />
      <v-chip color="green darken-2" dark class="d-flex align-center px-3 py-1">
        <v-icon left small>mdi-account-group</v-icon>
        {{ totalStudents }} Students
      </v-chip>
    </v-toolbar>

    <v-divider />

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="students"
      :items-per-page="itemsPerPage"
      item-key="id"
      hide-default-footer
    >
      <!-- Course -->
      <template slot="item.course" slot-scope="{ item }">
        {{ item.course ? item.course.name : "-" }}
      </template>

      <!-- Branch -->
      <template slot="item.branch" slot-scope="{ item }">
        {{ item.branch ? item.branch.name : "-" }}
      </template>

      <!-- Status -->
      <template slot="item.status" slot-scope="{ item }">
        <v-chip
          small
          :color="item.status === 'active' ? 'green' : 'orange'"
          dark
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Actions -->
      <template slot="item.action" slot-scope="{ item }">
        <v-btn icon small color="blue" @click="$emit('edit-student', item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn icon small color="red" @click="confirmDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-divider />

    <!-- Pagination -->
    <v-card-actions class="justify-center">
      <v-pagination
        v-model="localPage"
        :length="pageCount"
        total-visible="7"
      />
    </v-card-actions>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete
          <strong>{{ studentToDelete && studentToDelete.name }}</strong>?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" @click="deleteStudentAPI">
            Delete
          </v-btn>
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
        { text: "Code", value: "code" },
        { text: "Name", value: "name" },
        { text: "Course", value: "course" },
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
    localPage(page) {
      this.SET_PAGE(page);
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
    },
  },

  mounted() {
    this.fetchStudents();
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
