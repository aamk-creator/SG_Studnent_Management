<template>
  <v-container fluid class="grey lighten-5 py-10 px-12">
    <!-- Header -->
    <v-row align="center" class="mb-10">
      <v-avatar color="indigo lighten-5" size="72" class="mr-5">
        <v-icon x-large color="indigo">mdi-shard</v-icon>
      </v-avatar>
      <div>
        <h1 class="display-1 font-weight-black grey--text text--darken-4 mb-0">Courses Management</h1>
        <span class="text-uppercase overline font-weight-bold primary--text">Manage your Courses & Branches</span>
      </div>
    </v-row>

    
    <div class="d-flex align-center mb-3 ml-2">
      <v-icon small color="indigo" class="mr-2">mdi-plus-box-multiple</v-icon>
      <span class="text-uppercase font-weight-black grey--text text--darken-1 subtitle-2" style="letter-spacing: 1px">
        Add New Branch
      </span>
    </div>
    
    <v-hover v-slot="{ hover }">
      <v-card 
        :elevation="hover ? 6 : 2" 
        class="transition-swing rounded-pill mb-4 pr-2 pl-6 py-1 d-flex align-center border-0 white"
        height="70"
      >
        <v-icon size="32" color="indigo lighten-1" class="mr-4">mdi-office-building-cog</v-icon>
        <v-text-field
          v-model="newBranch.name"
          placeholder="Type branch name..."
          flat solo hide-details
          background-color="transparent"
          class="text-h6 font-weight-medium"
          @keyup.enter="addBranch"
        />
        <v-btn
          color="indigo"
          dark depressed
          height="54"
          width="160"
          class="rounded-pill font-weight-bold"
          :loading="loadingBranch"
          @click="addBranch"
        >
          ADD
        </v-btn>
      </v-card>
    </v-hover>

    <v-slide-group show-arrows class="mb-12">
      <v-slide-item v-for="branch in branches" :key="branch.id">
        <v-card outlined class="ma-2 rounded-pill d-flex align-center pl-4 pr-1 py-1 white border-soft" height="40">
          <span class="caption font-weight-bold grey--text text--darken-2 mr-4">{{ branch.name }}</span>
          <v-btn icon x-small color="red lighten-4" @click="confirmDeleteBranch(branch)" style="background-color: #FEE2E2">
            <v-icon x-small color="red">mdi-close</v-icon>
          </v-btn>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <!-- Course Section -->
    <div class="d-flex align-center mb-3 ml-2">
      <v-icon small color="teal" class="mr-2">mdi-book-plus</v-icon>
      <span class="text-uppercase font-weight-black grey--text text--darken-1 subtitle-2" style="letter-spacing: 1px">
        Add New Course
      </span>
    </div>

    <v-card class="rounded-xl elevation-2 mb-12 border-0 overflow-hidden">
      <v-row no-gutters align="center" class="pa-4 grey lighten-4">
        <v-col class="px-2">
          <v-text-field
            v-model="newCourse.name"
            placeholder="Course Name"
            flat solo hide-details
            background-color="white"
            class="rounded-lg shadow-sm"
          />
        </v-col>

        <v-col class="px-2">
          <v-text-field
            v-model="newCourse.title"
            placeholder="Course Title"
            flat solo hide-details
            background-color="white"
            class="rounded-lg shadow-sm"
          />
        </v-col>

        <v-col class="px-2">
          <v-textarea
            v-model="newCourse.description"
            placeholder="Course Description"
            flat solo hide-details
            background-color="white"
            class="rounded-lg shadow-sm"
            rows="1"
          />
        </v-col>

        <v-col class="px-2">
          <v-select
            v-model="newCourse.branch_id"
            :items="branches"
            item-text="name"
            item-value="id"
            placeholder="Select Branch"
            flat solo hide-details
            background-color="white"
            class="rounded-lg shadow-sm"
          />
        </v-col>

        <v-col cols="12" md="3" class="px-2 d-flex">
          <v-menu v-model="startMenu" :close-on-content-click="false" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="newCourse.course_start_at"
                placeholder="Start Date"
                prepend-inner-icon="mdi-calendar"
                readonly flat solo hide-details background-color="white"
                class="rounded-l-lg shadow-sm mr-1"
                v-bind="attrs" v-on="on"
              />
            </template>
            <v-date-picker v-model="newCourse.course_start_at" @input="startMenu = false" />
          </v-menu>

          <v-menu v-model="endMenu" :close-on-content-click="false" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="newCourse.course_end_at"
                placeholder="End Date"
                readonly flat solo hide-details background-color="white"
                class="rounded-r-lg shadow-sm"
                v-bind="attrs" v-on="on"
              />
            </template>
            <v-date-picker v-model="newCourse.course_end_at" @input="endMenu = false" />
          </v-menu>
        </v-col>

        <v-col class="px-4" cols="auto">
          <v-btn fab color="teal darken-1" dark depressed :loading="loadingCourse" @click="addCourse">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Courses List -->
    <div class="d-flex align-center mb-3 ml-2">
      <v-icon small color="blue-grey" class="mr-2">mdi-format-list-bulleted</v-icon>
      <span class="text-uppercase font-weight-black grey--text text--darken-1 subtitle-2" style="letter-spacing: 1px">
        Courses List
      </span>
    </div>

    <v-card class="rounded-xl elevation-4 border-0 overflow-hidden">
      <v-data-table :headers="courseHeaders" :items="courses" class="custom-modern-table" :items-per-page="5">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn depressed fab x-small color="teal lighten-5" class="mr-2" @click="openCourseModal(item)">
            <v-icon color="teal" small>mdi-certificate-outline</v-icon>
          </v-btn>
          <v-btn depressed fab x-small color="red lighten-5" @click="confirmDeleteCourse(item)">
            <v-icon color="red" small>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <!-- Delete Confirmation Dialog -->
<v-dialog v-model="confirmDeleteDialog" max-width="400px">
  <v-card>
    <v-card-title class="headline">
      Confirm Delete
    </v-card-title>
    <v-card-text>
      Are you sure you want to delete
      <strong>{{ itemToDelete?.name }}</strong>?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="grey darken-1" @click="cancelDelete">Cancel</v-btn>
      <v-btn text color="red darken-1" @click="performDelete">Delete</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
    </v-card>
  </v-container>

  

  
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "AllCourses",
  data() {
    return {
      loadingBranch: false,
      newBranch: { name: "" },
      branches: [],
      loadingCourse: false,
      newCourse: {
        name: "",
        title: "",
        description: "",
        branch_id: null,
        course_start_at: null,
        course_end_at: null,
      },
      startMenu: false,
      endMenu: false,
      courses: [],
      courseHeaders: [
        { text: "Course Name", value: "name" },
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Branch", value: "branch.name" },
        { text: "Start Date", value: "course_start_at" },
        { text: "End Date", value: "course_end_at" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      // Delete
      confirmDeleteDialog: false,
      itemToDelete: null,
      deleteType: null,
      // Snackbar
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
    };
  },
  methods: {
    async fetchBranches() {
      try {
        const res = await axios.get("/branches");
        this.branches = res.data.data || [];
        if (this.branches.length && !this.newCourse.branch_id)
          this.newCourse.branch_id = this.branches[0].id;
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to fetch branches", "error");
      }
    },
    async addBranch() {
      if (!this.newBranch.name) return;
      this.loadingBranch = true;
      try {
        const res = await axios.post("/branches", this.newBranch);
        this.branches.push(res.data.data || res.data);
        this.newBranch.name = "";
        this.showSnackbar("Branch added successfully", "success");
      } catch (err) {
        console.error(err);
        this.showSnackbar(err.response?.data?.message || "Failed to add branch", "error");
      } finally {
        this.loadingBranch = false;
      }
    },
    async fetchCourses() {
      try {
        const res = await axios.get("/courses");
        this.courses = res.data.data || [];
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to fetch courses", "error");
      }
    },
    async addCourse() {
      if (!this.newCourse.name || !this.newCourse.branch_id) return;
      this.loadingCourse = true;
      try {
        const payload = {
          name: this.newCourse.name,
          title: this.newCourse.title || "",
          description: this.newCourse.description || "",
          branch_id: Number(this.newCourse.branch_id),
          course_start_at: this.newCourse.course_start_at
            ? new Date(this.newCourse.course_start_at).toISOString().split("T")[0]
            : null,
          course_end_at: this.newCourse.course_end_at
            ? new Date(this.newCourse.course_end_at).toISOString().split("T")[0]
            : null,
        };
        const res = await axios.post("/courses", payload);
        this.courses.push(res.data.data || res.data);
        this.newCourse = {
          name: "",
          title: "",
          description: "",
          branch_id: this.branches.length ? this.branches[0].id : null,
          course_start_at: null,
          course_end_at: null,
        };
        this.showSnackbar("Course added successfully", "success");
      } catch (err) {
        console.error(err);
        this.showSnackbar(err.response?.data?.message || "Failed to add course", "error");
      } finally {
        this.loadingCourse = false;
      }
    },
    confirmDeleteBranch(branch) {
      this.itemToDelete = branch;
      this.deleteType = "branch";
      this.confirmDeleteDialog = true;
    },
    confirmDeleteCourse(course) {
      this.itemToDelete = course;
      this.deleteType = "course";
      this.confirmDeleteDialog = true;
    },
    cancelDelete() {
      this.itemToDelete = null;
      this.deleteType = null;
      this.confirmDeleteDialog = false;
    },
    async performDelete() {
      if (!this.itemToDelete || !this.deleteType) return;
      try {
        if (this.deleteType === "branch") {
          await axios.delete(`/branches/${this.itemToDelete.id}`);
          this.branches = this.branches.filter(b => b.id !== this.itemToDelete.id);
        } else if (this.deleteType === "course") {
          await axios.delete(`/courses/${this.itemToDelete.id}`);
          this.courses = this.courses.filter(c => c.id !== this.itemToDelete.id);
        }
        this.showSnackbar("Deleted successfully", "success");
      } catch (err) {
        console.error(err);
        this.showSnackbar("Failed to delete", "error");
      } finally {
        this.cancelDelete();
      }
    },
    showSnackbar(message, color = "success") {
      this.snackbarText = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
  mounted() {
    this.fetchBranches();
    this.fetchCourses();
  },
};
</script>

<style scoped>
.border-soft {
  border: 1px solid #E5E7EB !important;
}
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
}
.custom-modern-table >>> thead {
  background-color: #F9FAFB !important;
}
.custom-modern-table >>> th {
  text-transform: uppercase !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  color: #6B7280 !important;
  border-bottom: none !important;
}
.custom-modern-table >>> td {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  border-bottom: 1px solid #F3F4F6 !important;
}
.border-0 {
  border: none !important;
}
.v-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
