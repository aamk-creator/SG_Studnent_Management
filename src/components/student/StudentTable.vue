<template>
  <v-card>
    <!-- Toolbar with Search & Filter -->
    <v-toolbar flat color="white">
      <!-- Title with total number of students -->
      <v-toolbar-title>
        All Students List ({{ allStudents.length }})
      </v-toolbar-title>
      <v-spacer />

      <!-- Search input -->
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search students...."
        single-line
        hide-details
        dense
        class="mr-3"
      ></v-text-field>

      <!-- Single filter dropdown -->
      <v-select
        v-model="filterType"
        :items="filterOptions"
        label="Filter"
        dense
        outlined
        hide-details
        style="max-width: 180px"
      ></v-select>

      <!-- Value select appears only if filter chosen -->
      <v-select
        v-if="filterType && filterType !== 'All'"
        v-model="filterValue"
        :items="getFilterItems"
        dense
        outlined
        hide-details
        style="max-width: 180px"
      ></v-select>
    </v-toolbar>

    <v-divider />

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="filteredStudents"
      :search="search"
      :items-per-page="perPage"
      :page.sync="localPage"
      item-key="id"
      dense
      hide-default-footer
    >
      <!-- Course column -->
      <template slot="item.course" slot-scope="props">
        {{ props.item.course ? props.item.course.name : '-' }}
      </template>

      <!-- Branch column -->
      <template slot="item.branch" slot-scope="props">
        {{ props.item.branch ? props.item.branch.name : '-' }}
      </template>

      <!-- Status column -->
      <template slot="item.status" slot-scope="props">
        <v-chip
          small
          :color="props.item.status === 'active' ? 'green' : 'orange'"
          dark
        >
          {{ props.item.status }}
        </v-chip>
      </template>

      <!-- Actions column -->
      <template slot="item.actions" slot-scope="props">
        <!-- SINGLE DELETE BUTTON -->
        <v-btn
          icon
          small
          color="red"
          @click="openDeleteDialog(props.item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>

        <!-- EDIT BUTTON -->
        <v-btn
          icon
          small
          color="blue"
          @click="editStudent(props.item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    

    <!-- Pagination -->
    <v-divider />
    <v-card-actions class="justify-center">
      <v-pagination v-model="localPage" :length="pageCount" />
    </v-card-actions>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete <strong>{{ studentToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="cancelDelete">Cancel</v-btn>
          <v-btn color="red" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "StudentTable",
  data() {
    return {
      search: "",
      filterType: null,
      filterValue: null,
      localPage: 1,
      perPage: 10,
      headers: [
        { text: "ID", value: "id" },
        { text: "Code", value: "code" },
        { text: "Name", value: "name" },
        { text: "Course", value: "course" },
        { text: "Branch", value: "branch" },
        { text: "Status", value: "status" },
        { text: "Action", value: "actions", sortable: false },
      ],
      filterOptions: ["All", "Course", "Branch", "Status"],

      // Delete confirmation
      confirmDeleteDialog: false,
      studentToDelete: null,
    };
  },
  computed: {
    ...mapState("students", ["students"]),

    allStudents() {
      return this.students;
    },

    getFilterItems() {
      if (!this.filterType || this.filterType === "All") return [];
      if (this.filterType === "Course")
        return [...new Set(this.allStudents.map((s) => s.course?.name).filter(Boolean))];
      if (this.filterType === "Branch")
        return [...new Set(this.allStudents.map((s) => s.branch?.name).filter(Boolean))];
      if (this.filterType === "Status") return ["active", "inactive"];
      return [];
    },

    filteredStudents() {
      let students = this.allStudents;
      if (this.filterType && this.filterType !== "All" && this.filterValue) {
        if (this.filterType === "Course") students = students.filter((s) => s.course?.name === this.filterValue);
        else if (this.filterType === "Branch") students = students.filter((s) => s.branch?.name === this.filterValue);
        else if (this.filterType === "Status") students = students.filter((s) => s.status === this.filterValue);
      }
      return students;
    },

    pageCount() {
      return Math.ceil(this.filteredStudents.length / this.perPage);
    },
  },
  methods: {
    ...mapActions("students", ["fetchStudents", "deleteStudent"]),

    // Emit event to parent for edit
    editStudent(student) {
      this.$emit("edit-student", student);
    },

    // Open delete dialog
    openDeleteDialog(student) {
      this.studentToDelete = student;
      this.confirmDeleteDialog = true;
    },

    // Cancel delete
    cancelDelete() {
      this.studentToDelete = null;
      this.confirmDeleteDialog = false;
    },

    // Confirm delete
    async confirmDelete() {
      if (!this.studentToDelete) return;

      try {
        await this.deleteStudent(this.studentToDelete.id);
        this.confirmDeleteDialog = false;
        this.studentToDelete = null;
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete student");
      }
    },
  },
  mounted() {
    this.fetchStudents();
  },
};
</script>

<style scoped>
.v-toolbar {
  padding-left: 8px;
  padding-right: 14px;
}
</style>
