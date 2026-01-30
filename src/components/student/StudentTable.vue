<template>
  <v-card class="rounded-xl border-0 elevation-0 transparent">
    <!-- Header -->
    <v-row no-gutters align="center" class="pa-4 white rounded-t-xl border-bottom">
      <div class="d-flex align-center mr-6">
        <v-avatar size="40" color="primary lighten-5" class="mr-3">
          <v-icon color="primary" small>mdi-account-group</v-icon>
        </v-avatar>
        <span class="text-h6 font-weight-black grey--text text--darken-3">
          Total Students <span class="primary--text ml-1">{{ allStudents.length }}</span>
        </span>
      </div>

      <v-spacer />

      <!-- Search -->
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search students..."
        flat solo hide-details
        dense
        background-color="grey lighten-4"
        class="rounded-pill mr-4 shadow-sm"
        style="max-width: 300px"
      />

      <!-- Filter -->
      <v-select
        v-model="filterType"
        :items="filterOptions"
        placeholder="Filter By"
        flat solo hide-details dense
        background-color="grey lighten-4"
        class="rounded-l-pill shadow-sm"
        style="max-width: 140px"
        prepend-inner-icon="mdi-filter-variant"
      />

      <v-select
        v-if="filterType && filterType !== 'All'"
        v-model="filterValue"
        :items="getFilterItems"
        placeholder="Select Value"
        flat solo hide-details dense
        background-color="grey lighten-4"
        class="rounded-r-pill shadow-sm border-left"
        style="max-width: 160px"
      />
    </v-row>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="filteredStudents"
      :search="search"
      :items-per-page="perPage"
      :page.sync="localPage"
      hide-default-footer
      class="custom-modern-table"
    >
      <!-- Course -->
      <template v-slot:[`item.course`]="{ item }">
        <span class="font-weight-medium grey--text text--darken-2">
          {{ item.course ? item.course.name : '-' }}
        </span>
      </template>

      <!-- Branch -->
      <template v-slot:[`item.branch`]="{ item }">
        <v-chip x-small outlined color="blue-grey lighten-1" class="font-weight-bold">
          {{ item.branch ? item.branch.name : '-' }}
        </v-chip>
      </template>

      <!-- Status -->
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          small
          :color="item.status === 'active' ? 'green lighten-5' : 'orange lighten-5'"
          :class="item.status === 'active' ? 'green--text text--darken-2' : 'orange--text text--darken-2'"
          class="font-weight-black px-4"
        >
          <v-badge
            dot inline left
            :color="item.status === 'active' ? 'green' : 'orange'"
            class="mr-1"
          />
          {{ item.status.toUpperCase() }}
        </v-chip>
      </template>

      <!-- Password with Eye Toggle -->
      <template v-slot:[`item.password`]="{ item }">
        <div class="d-flex align-center">
          <span>{{ showPassword[item.id] ? item.plain_password : '••••••' }}</span>
          <v-icon
            small
            class="ml-2 cursor-pointer"
            @click="togglePassword(item.id)"
          >
            {{ showPassword[item.id] ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
          </v-icon>
        </div>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn depressed fab x-small color="blue lighten-5" class="mr-2" @click="editStudent(item)">
          <v-icon small color="blue">mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn depressed fab x-small color="red lighten-5" @click="openDeleteDialog(item)">
          <v-icon small color="red">mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <div class="white pa-4 rounded-b-xl d-flex align-center justify-center">
      <v-pagination
        v-model="localPage"
        :length="pageCount"
        circle
        color="primary"
        total-visible="7"
      />
    </div>

    <!-- Delete Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="text-h5 font-weight-black red--text">Confirm Delete</v-card-title>
        <v-card-text class="text-h6 font-weight-regular pt-2">
          Remove student <span class="font-weight-black">{{ studentToDelete?.name }}</span>? This cannot be undone.
        </v-card-text>
        <v-card-actions class="pt-4">
          <v-spacer />
          <v-btn text color="grey darken-1" class="rounded-pill px-6" @click="cancelDelete">Cancel</v-btn>
          <v-btn color="red" dark depressed class="rounded-pill px-8" @click="confirmDelete">Delete</v-btn>
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
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: "Password", value: "password" }, // show password column
        { text: "Course", value: "course" },
        { text: "Branch", value: "branch" },
        { text: "Status", value: "status" },
        { text: "Action", value: "actions", sortable: false },
      ],
      filterOptions: ["All", "Course", "Branch", "Status"],

      // Delete confirmation
      confirmDeleteDialog: false,
      studentToDelete: null,

      // Show/hide password map
      showPassword: {},
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

    editStudent(student) {
      this.$emit("edit-student", student);
    },

    openDeleteDialog(student) {
      this.studentToDelete = student;
      this.confirmDeleteDialog = true;
    },

    cancelDelete() {
      this.studentToDelete = null;
      this.confirmDeleteDialog = false;
    },

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

    togglePassword(studentId) {
      this.$set(this.showPassword, studentId, !this.showPassword[studentId]);
    },
  },
  mounted() {
    this.fetchStudents();
  },
};
</script>
