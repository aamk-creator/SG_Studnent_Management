<template>
  <v-card class="rounded-xl border-0 elevation-0 transparent">
    <!-- Header -->
    <v-row
      no-gutters
      align="center"
      class="pa-4 white rounded-t-xl border-bottom"
    >
      <div class="d-flex align-center mr-6">
        <v-avatar size="40" color="primary lighten-5" class="mr-3">
          <v-icon color="primary" small>mdi-account-group</v-icon>
        </v-avatar>
        <span class="text-h6 font-weight-black grey--text text--darken-3">
          Total Students
          <span class="primary--text ml-1">{{ filteredStudents.length }}</span>
        </span>
      </div>

      <v-spacer />

      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search students..."
        flat
        solo
        hide-details
        dense
        background-color="grey lighten-4"
        class="rounded-pill mr-4 shadow-sm"
        style="max-width: 300px"
      />

      <v-select
        v-model="filterType"
        :items="filterOptions"
        placeholder="Filter By"
        flat
        solo
        hide-details
        dense
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
        flat
        solo
        hide-details
        dense
        background-color="grey lighten-4"
        class="rounded-r-pill shadow-sm border-left"
        style="max-width: 160px"
      />
    </v-row>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="paginatedStudents"
      :items-per-page="perPage"
      hide-default-footer
      class="custom-modern-table"
    >
      <!-- Course -->
      <template v-slot:[`item.course`]="{ item }">
        {{ item.course?.name || "-" }}
      </template>

      <!-- Branch -->
      <template v-slot:[`item.branch`]="{ item }">
        {{ item.branch?.name || "-" }}
      </template>

      <!-- Status -->
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          :color="
            item.status === 'active'
              ? 'green lighten-5'
              : 'orange lighten-5'
          "
          small
        >
          {{ item.status.toUpperCase() }}
        </v-chip>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          fab
          x-small
          color="blue lighten-5"
          class="mr-2"
          @click="openEditDialog(item)"
        >
          <v-icon small color="blue">mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn
          fab
          x-small
          color="red lighten-5"
          @click="openDeleteDialog(item)"
        >
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

    <!-- EDIT STUDENT DIALOG -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Edit Student</v-card-title>
        <v-card-text>
          <v-text-field v-model="editForm.code" label="Code" />
          <v-text-field v-model="editForm.name" label="Name" />
          <v-text-field v-model="editForm.email" label="Email" />
          <v-text-field v-model="editForm.phone" label="Phone" type="tel" />

          <v-select
            v-model="editForm.course_id"
            :items="courseOptions"
            label="Course"
            item-text="name"
            item-value="id"
          />
          <v-select
            v-model="editForm.branch_id"
            :items="branchOptions"
            label="Branch"
            item-text="name"
            item-value="id"
          />
          <v-select
            v-model="editForm.status"
            :items="['active', 'inactive']"
            label="Status"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey darken-1" @click="editDialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="saveEdit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DELETE CONFIRM DIALOG -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete
          <strong>{{ itemToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey darken-1" @click="cancelDelete">
            Cancel
          </v-btn>
          <v-btn text color="red darken-1" @click="performDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

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
        { text: "Course", value: "course" },
        { text: "Branch", value: "branch" },
        { text: "Status", value: "status" },
        { text: "Action", value: "actions", sortable: false },
      ],

      filterOptions: ["All", "Course", "Branch", "Status"],

      editDialog: false,
      editForm: {},

      confirmDeleteDialog: false,
      itemToDelete: null,

      courseOptions: [],
      branchOptions: [],
    };
  },

  computed: {
    ...mapState("students", ["students"]),

    getFilterItems() {
      if (!this.filterType || this.filterType === "All") return [];
      if (this.filterType === "Course")
        return [...new Set(this.students.map(s => s.course?.name).filter(Boolean))];
      if (this.filterType === "Branch")
        return [...new Set(this.students.map(s => s.branch?.name).filter(Boolean))];
      if (this.filterType === "Status") return ["active", "inactive"];
      return [];
    },

    filteredStudents() {
      let result = this.students;
      if (this.filterType && this.filterType !== "All" && this.filterValue) {
        if (this.filterType === "Course")
          result = result.filter(s => s.course?.name === this.filterValue);
        if (this.filterType === "Branch")
          result = result.filter(s => s.branch?.name === this.filterValue);
        if (this.filterType === "Status")
          result = result.filter(s => s.status === this.filterValue);
      }

      // Apply search
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(
          s =>
            s.name.toLowerCase().includes(searchLower) ||
            s.code.toLowerCase().includes(searchLower) ||
            (s.email && s.email.toLowerCase().includes(searchLower)) ||
            (s.phone && s.phone.toLowerCase().includes(searchLower))
        );
      }

      return result;
    },

    paginatedStudents() {
      const start = (this.localPage - 1) * this.perPage;
      return this.filteredStudents.slice(start, start + this.perPage);
    },

    pageCount() {
      return Math.ceil(this.filteredStudents.length / this.perPage);
    },
  },

  methods: {
    openEditDialog(student) {
      this.editForm = {
        id: student.id,
        code: student.code,
        name: student.name,
        email: student.email,
        phone: student.phone,
        course_id: student.course?.id || null,
        branch_id: student.branch?.id || null,
        status: student.status,
      };
      this.editDialog = true;
    },

    async saveEdit() {
      await this.$store.dispatch("students/updateStudent", this.editForm);
      this.editDialog = false;
    },

    openDeleteDialog(student) {
      this.itemToDelete = student;
      this.confirmDeleteDialog = true;
    },

    cancelDelete() {
      this.itemToDelete = null;
      this.confirmDeleteDialog = false;
    },

    async performDelete() {
      await this.$store.dispatch(
        "students/deleteStudent",
        this.itemToDelete.id
      );
      this.confirmDeleteDialog = false;
    },
  },

  mounted() {
    this.$store.dispatch("students/fetchStudents");
    this.courseOptions = this.students.map(s => s.course).filter(Boolean);
    this.branchOptions = this.students.map(s => s.branch).filter(Boolean);
  },
};
</script>
