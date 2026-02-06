<template>
  <v-container fluid class="grey lighten-5 py-10 px-12">
    <!-- Header -->
    <v-row align="center" class="mb-10">
      <v-avatar color="indigo lighten-5" size="72" class="mr-5">
        <v-icon x-large color="indigo">mdi-school</v-icon>
      </v-avatar>
      <div>
        <h1 class="text-h5 font-weight-black grey--text text--darken-4 mb-0">
          Courses Management
        </h1>
        <span
          class="text-uppercase text-caption font-weight-bold primary--text"
        >
          Manage and Monitor Student Records
        </span>
      </div>
    </v-row>

    <!-- Add Branch -->
    <div class="d-flex align-center mb-3 ml-2">
      <v-icon small color="indigo" class="mr-2">mdi-plus-box-multiple</v-icon>
      <span
        class="text-uppercase font-weight-black grey--text text--darken-1 subtitle-2"
        style="letter-spacing: 1px"
      >
        Add New Branch
      </span>
    </div>

    <v-hover v-slot="{ hover }">
      <v-card
        :elevation="hover ? 6 : 2"
        class="transition-swing rounded-pill mb-4 pr-2 pl-6 py-1 d-flex align-center border-0 white"
        height="70"
      >
        <v-icon size="32" color="indigo lighten-1" class="mr-4"
          >mdi-office-building-cog</v-icon
        >
        <v-text-field
          v-model="newBranch.name"
          placeholder="Type your new branch to add..."
          flat
          solo
          hide-details
          background-color="transparent"
          class="text-h6 font-weight-medium"
          @keyup.enter="addBranch"
        />
        <v-btn
          class="add-branch-btn"
          color="teal darken-1"
          dark
          rounded
          depressed
          :loading="loadingBranch"
          @click="addBranch"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card>
    </v-hover>

    <v-slide-group show-arrows class="mb-12">
      <v-slide-item v-for="branch in branches" :key="branch.id">
        <v-card
          outlined
          class="ma-2 rounded-pill d-flex align-center pl-4 pr-1 py-1 white border-soft"
          height="40"
        >
          <span
            class="caption font-weight-bold grey--text text--darken-2 mr-4"
            >{{ branch.name }}</span
          >
          <v-btn
            icon
            x-small
            color="red lighten-4"
            @click="deleteBranch(branch)"
            style="background-color: #fee2e2"
          >
            <v-icon x-small color="red">mdi-close</v-icon>
          </v-btn>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <!-- Add Course -->
    <div class="d-flex align-center mb-3 ml-2">
      <v-icon small color="teal" class="mr-2">mdi-book-plus</v-icon>
      <span
        class="text-uppercase font-weight-black grey--text text--darken-1 subtitle-2"
        style="letter-spacing: 1px"
      >
        Add New Course
      </span>
    </div>

    <v-card class="rounded-xl elevation-2 mb-12 border-0 overflow-hidden">
      <v-row no-gutters align="center" class="pa-4 grey lighten-4">
        <v-col cols="12" class="mb-2">
          <v-text-field
            v-model="newCourse.name"
            placeholder="Course Name"
            flat
            solo
            hide-details
            background-color="white"
            class="rounded-lg shadow-sm"
          />
        </v-col>

        <v-col cols="12" class="mb-2">
          <v-text-field
            v-model="newCourse.title"
            placeholder="Course Title"
            flat
            solo
            hide-details
            background-color="white"
            class="rounded-lg shadow-sm"
          />
        </v-col>

        <v-col cols="12" class="mb-2">
          <v-textarea
            v-model="newCourse.description"
            placeholder="Course Description"
            flat
            solo
            hide-details
            background-color="white"
            class="rounded-lg shadow-sm"
            rows="1"
          />
        </v-col>

        <v-col cols="12" class="mb-2">
          <v-select
            v-model="newCourse.branch_id"
            :items="branches"
            item-text="name"
            item-value="id"
            placeholder="Select Branch"
            flat
            solo
            hide-details
            background-color="white"
            class="rounded-lg shadow-sm"
          />
        </v-col>

        <v-col cols="12" md="6" class="mb-2">
          <v-menu
            v-model="startMenu"
            :close-on-content-click="false"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="newCourse.course_start_at"
                placeholder="Start Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                flat
                solo
                hide-details
                background-color="white"
                class="rounded-l-lg shadow-sm"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="newCourse.course_start_at"
              @input="startMenu = false"
            />
          </v-menu>
        </v-col>

        <v-col cols="12" md="6">
          <v-menu
            v-model="endMenu"
            :close-on-content-click="false"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="newCourse.course_end_at"
                placeholder="End Date"
                readonly
                flat
                solo
                hide-details
                background-color="white"
                class="rounded-r-lg shadow-sm"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="newCourse.course_end_at"
              @input="endMenu = false"
            />
          </v-menu>
        </v-col>
        <v-col cols="12" class="mt-2 d-flex justify-end">
          <v-btn
            class="add-course-btn"
            color="teal darken-1"
            dark
            rounded
            depressed
            :loading="loadingCourse"
            @click="addCourse"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Courses List -->
    <div class="d-flex align-center mb-3 ml-2">
      <v-icon small color="blue-grey" class="mr-2"
        >mdi-format-list-bulleted</v-icon
      >
      <span
        class="text-uppercase font-weight-black grey--text text--darken-1 subtitle-2"
        style="letter-spacing: 1px"
      >
        Courses List
      </span>
    </div>

    <v-card class="rounded-xl elevation-4 border-0 overflow-hidden">
      <v-data-table
        :headers="courseHeaders"
        :items="courses"
        class="custom-modern-table"
        :items-per-page="5"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            depressed
            fab
            x-small
            color="blue lighten-4"
            class="mr-2"
            @click="openEditDialog(item)"
          >
            <v-icon color="blue" small>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn
            depressed
            fab
            x-small
            color="red lighten-5"
            @click="deleteCourse(item)"
          >
            <v-icon color="red" small>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Course Dialog -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title>Edit Course</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editCourseForm.name"
            label="Course Name"
            outlined
            dense
            class="mb-3"
          />
          <v-text-field
            v-model="editCourseForm.title"
            label="Course Title"
            outlined
            dense
            class="mb-3"
          />
          <v-textarea
            v-model="editCourseForm.description"
            label="Course Description"
            outlined
            dense
            rows="2"
            class="mb-3"
          />
          <v-select
            v-model="editCourseForm.branch_id"
            :items="branches"
            item-text="name"
            item-value="id"
            label="Select Branch"
            outlined
            dense
            class="mb-3"
          />
          <v-menu
            v-model="editStartMenu"
            :close-on-content-click="false"
            offset-y
            min-width="auto"
            class="mb-3"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="editCourseForm.course_start_at"
                label="Start Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="editCourseForm.course_start_at"
              @input="editStartMenu = false"
            />
          </v-menu>

          <v-menu
            v-model="editEndMenu"
            :close-on-content-click="false"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="editCourseForm.course_end_at"
                label="End Date"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="editCourseForm.course_end_at"
              @input="editEndMenu = false"
            />
          </v-menu>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey" @click="editDialog = false">Cancel</v-btn>
          <v-btn text color="teal" @click="updateCourse">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      top
      right
      timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loadingBranch: false,
      loadingCourse: false,
      newBranch: { name: "" },
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
      editDialog: false,
      editCourseForm: {
        id: null,
        name: "",
        title: "",
        description: "",
        branch_id: null,
        course_start_at: null,
        course_end_at: null,
      },
      editStartMenu: false,
      editEndMenu: false,
      courseHeaders: [
        { text: "Course Name", value: "name" },
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Branch", value: "branch.name" },
        { text: "Start Date", value: "course_start_at" },
        { text: "End Date", value: "course_end_at" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
    };
  },
  computed: {
    branches() {
      return this.$store.getters["students/branches"];
    },
    courses() {
      return this.$store.getters["students/courses"];
    },
  },
  methods: {
    showSnackbar(msg, color = "success") {
      this.snackbarText = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },

    async addBranch() {
      if (!this.newBranch.name) return;
      this.loadingBranch = true;
      try {
        await this.$store.dispatch("students/addBranch", this.newBranch);
        this.newBranch.name = "";
        this.showSnackbar("Branch added successfully");
      } catch {
        this.showSnackbar("Failed to add branch", "error");
      } finally {
        this.loadingBranch = false;
      }
    },

    async addCourse() {
      if (!this.newCourse.name || !this.newCourse.branch_id) return;
      this.loadingCourse = true;
      try {
        await this.$store.dispatch("students/addCourse", { ...this.newCourse });
        this.newCourse = {
          name: "",
          title: "",
          description: "",
          branch_id: this.branches[0]?.id || null,
          course_start_at: null,
          course_end_at: null,
        };
        this.showSnackbar("Course added successfully");
      } catch {
        this.showSnackbar("Failed to add course", "error");
      } finally {
        this.loadingCourse = false;
      }
    },

    async deleteBranch(branch) {
      try {
        await this.$store.dispatch("students/deleteBranch", branch.id);
        this.showSnackbar("Branch deleted");
      } catch {
        this.showSnackbar("Failed to delete branch", "error");
      }
    },

    async deleteCourse(course) {
      try {
        await this.$store.dispatch("students/deleteCourse", course.id);
        this.showSnackbar("Course deleted");
      } catch {
        this.showSnackbar("Failed to delete course", "error");
      }
    },

    openEditDialog(course) {
      this.editCourseForm = { ...course };
      this.editDialog = true;
    },

    async updateCourse() {
      if (!this.editCourseForm.name || !this.editCourseForm.branch_id) return;
      try {
        await this.$store.dispatch("students/updateCourse", {
          ...this.editCourseForm,
        });
        this.showSnackbar("Course updated successfully");
        this.editDialog = false;
      } catch {
        this.showSnackbar("Failed to update course", "error");
      }
    },
  },
  mounted() {
    this.$store.dispatch("students/fetchBranches");
    this.$store.dispatch("students/fetchCourses");
  },
};
</script>

<style scoped>
.add-course-btn {
  width: 50px; /* circular button width */
  height: 50px; /* circular button height */
  min-width: 0; /* remove default min-width */
}

.add-branch-btn {
  width: 50px;   /* circular width */
  height: 50px;  /* circular height */
  min-width: 0;  /* remove default min-width */
}


</style>
