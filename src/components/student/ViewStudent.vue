<template>
  <v-container fluid>
    <!-- ACTION CARD -->
    <v-card class="mb-6 pa-4 elevation-3 rounded-lg">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon left color="primary" large
            >mdi-account-multiple-outline</v-icon
          >
          <span class="card-title">View All Students</span>
        </div>
      </v-card-title>

      <v-card-text class="pb-0">
        <span>View and manage all student records efficiently.</span>
      </v-card-text>

      <v-card-actions class="pt-2">
        <v-btn
          color="primary"
          rounded
          class="mr-3"
          small
          @click="opencard('add')"
        >
          <v-icon left>mdi-account-plus</v-icon>
          Add Student
        </v-btn>

        <v-btn
          color="red"
          rounded
          class="mr-3"
          small
          @click="opencard('delete')"
        >
          <v-icon left>mdi-account-remove</v-icon>
          Delete Student
        </v-btn>

        <v-btn color="green" rounded small @click="exportStudents">
          <v-icon left>mdi-export</v-icon>
          Export Students
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- STUDENT TABLE -->
    <StudentTable @edit-student="openEditStudent" />

    <!-- DIALOG FOR ADD, DELETE, EDIT -->
    <v-dialog
      v-model="dialog"
      max-width="600px"
      scrollable
      @click:outside="cls"
    >
      <v-card class="rounded-lg">
        <AddStudent v-if="card === 'add'" @close-dialog="cls" />
        <DeleteStudent v-if="card === 'delete'" @close-dialog="cls" />
        <EditStudent
          v-if="card === 'edit'"
          :student="selectedStudent"
          @close-dialog="cls"
        />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import StudentTable from "./StudentTable.vue";
import DeleteStudent from "./DeleteStudent.vue";
import AddStudent from "./AddStudent.vue";
import EditStudent from "./EditStudent.vue"; // New
import { mapState, mapMutations } from "vuex";

export default {
  name: "ViewStudent",
  components: { StudentTable, AddStudent, DeleteStudent, EditStudent },
  data() {
    return {
      dialog: false,
      card: "",
      selectedStudent: null, // for editing
      name: "",
      phone: "",
      address: "",
      branch: "",
      subjects: [],
      status: "pending",
      availableSubjects: [
        "Programming Fundamentals",
        "Data Structures",
        "Algorithms",
        "Database Systems",
        "Computer Networks",
        "Operating Systems",
      ],
      valid: false,
    };
  },
  computed: {
    ...mapState({
      totalStudents: (state) => state.students.length,
    }),
  },
  methods: {
    ...mapMutations(["ADD_STUDENT"]),

    opencard(cardName) {
      this.dialog = true;
      this.card = cardName;
    },

    cls() {
      this.dialog = false;
      this.card = "";
      this.selectedStudent = null;
    },

    openEditStudent(student) {
      this.selectedStudent = student;
      this.card = "edit";
      this.dialog = true;
    },

    addStudent() {
      if (!this.$refs.form.validate()) return;

      this.ADD_STUDENT({
        name: this.name,
        phone: this.phone,
        address: this.address,
        branch: this.branch,
        subjects: this.subjects,
        status: this.status,
      });

      this.name = "";
      this.phone = "";
      this.address = "";
      this.branch = "";
      this.subjects = [];
      this.status = "pending";
      this.$refs.form.resetValidation();

      this.cls();
      this.$nextTick(() => {
        alert("Student added successfully!");
      });
    },

    exportStudents() {
      alert("Export student data");
    },
  },
};
</script>

<style scoped>
.card-title {
  font-weight: 600;
  font-size: 20px;
}
.v-card {
  border-radius: 12px;
}
.v-card-actions .v-btn {
  text-transform: none;
}
</style>
