<template>
  <v-container fluid>
  
    <v-card class="mb-6">
      <v-card-title>
        <v-icon left color="primary">mdi-book-open-outline</v-icon>
        Course Management
      </v-card-title>
      <v-card-text>
        Manage all courses here. Total Courses: {{ courses.length }}
      </v-card-text>
    </v-card>

    
    <v-card class="mb-6">
      <v-card-title>Add New Course</v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            label="Course Name"
            v-model="newCourse"
            :rules="[v => !!v || 'Course name is required']"
            outlined
          />

           <v-text-field
            label="Batch"
            v-model="newCourse"
            :rules="[v => !!v || 'Batch is required']"
            outlined
          />

          <v-btn color="primary" :disabled="!valid" @click="addCourse">
            Add Course
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    
    <v-card>
      <v-data-table
  :headers="headers"
  :items="courseItems"
  item-key="id"
  :items-per-page="5"
  class="elevation-1"
>
  <template slot="item.actions" slot-scope="{ item }">
    <v-btn icon color="red" @click="deleteCourse(item.id)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </template>
</v-data-table>

    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "AllCourses",
  data() {
    return {
      valid: false,
      newCourse: "",
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",

      courses: [
        "Programming Fundamentals",
        "Data Structures",
        "Algorithms",
        "Database Systems",
        "Computer Networks",
        "Operating Systems"
      ],

      headers: [
        { text: "ID", value: "id" },
        { text: "Course Name", value: "name" },
        { text: "Actions", value: "actions", sortable: false }
      ]
    };
  },

  computed: {
    courseItems() {
      return this.courses.map((name, index) => ({
        id: index + 1,
        name
      }));
    }
  },

  methods: {
    addCourse() {
      if (!this.newCourse) return;

      this.courses.push(this.newCourse);
      this.snackbarText = `Course "${this.newCourse}" added`;
      this.snackbarColor = "success";
      this.snackbar = true;
      this.newCourse = "";
    },

    deleteCourse(id) {
      this.courses.splice(id - 1, 1);
      this.snackbarText = "Course deleted";
      this.snackbarColor = "error";
      this.snackbar = true;
    }
  }
};
</script>




