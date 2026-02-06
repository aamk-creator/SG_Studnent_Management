import axios from "@/plugins/axios";

export default {
  namespaced: true,

  state: {
    students: [],
    courses: [],
    branches: [],
    page: 1,
    perPage: 10,
    loading: false,
    error: "",
  },

  getters: {
    students: (state) => state.students,
    courses: (state) => state.courses,
    branches: (state) => state.branches,
    totalStudents: (state) => state.students.length,
    totalCourses: (state) => state.courses.length,
    totalBranches: (state) => state.branches.length,
    pageCount: (state) => Math.ceil(state.students.length / state.perPage),
    paginatedStudents: (state) => {
      const start = (state.page - 1) * state.perPage;
      return state.students.slice(start, start + state.perPage);
    },
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_STUDENTS(state, students) {
      state.students = students;
    },
    ADD_STUDENT(state, student) {
      state.students.unshift(student);
    },
    REMOVE_STUDENT(state, id) {
      state.students = state.students.filter((s) => s.id !== id);
    },
    UPDATE_STUDENT(state, updated) {
      const index = state.students.findIndex((s) => s.id === updated.id);
      if (index !== -1) state.students.splice(index, 1, updated);
    },
    SET_COURSES(state, courses) {
      state.courses = courses;
    },

    
    UPDATE_COURSE(state, updated) {
      const index = state.courses.findIndex((c) => c.id === updated.id);
      if (index !== -1) {
        state.courses.splice(index, 1, updated);
      }
    },

    SET_BRANCHES(state, branches) {
      state.branches = branches;
    },
    SET_PAGE(state, page) {
      state.page = page;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_ERROR(state, value) {
      state.error = value;
    },
  },

  actions: {
    // Fetch students
    async fetchStudents({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", "");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit("SET_STUDENTS", res.data.data || []);
      } catch (err) {
        console.error(err);
        commit(
          "SET_ERROR",
          err.response?.data?.message || "Failed to fetch students"
        );
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Add student
    async addStudent({ commit }, payload) {
      commit("SET_ERROR", "");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("/students/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit("ADD_STUDENT", res.data.data);
      } catch (err) {
        console.error(err);
        commit(
          "SET_ERROR",
          err.response?.data?.message || "Failed to add student"
        );
        throw err;
      }
    },

    // Update student
    async updateStudent({ commit }, payload) {
      commit("SET_ERROR", "");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`/students/${payload.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit("UPDATE_STUDENT", res.data.data);
      } catch (err) {
        console.error(err);
        commit(
          "SET_ERROR",
          err.response?.data?.message || "Failed to update student"
        );
        throw err;
      }
    },

    // Delete student
    async deleteStudent({ commit }, id) {
      commit("SET_ERROR", "");
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit("REMOVE_STUDENT", id);
      } catch (err) {
        console.error(err);
        commit(
          "SET_ERROR",
          err.response?.data?.message || "Failed to delete student"
        );
      }
    },

    // Fetch branches
    async fetchBranches({ commit }) {
      commit("SET_ERROR", "");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/branches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit("SET_BRANCHES", res.data.data || []);
      } catch (err) {
        console.error(err);
        commit(
          "SET_ERROR",
          err.response?.data?.message || "Failed to fetch branches"
        );
      }
    },

    // Add branch
    async addBranch({ dispatch }, payload) {
      try {
        const token = localStorage.getItem("token");
        await axios.post("/branches", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await dispatch("fetchBranches"); // update dashboard automatically
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    // Delete branch
    async deleteBranch({ dispatch }, id) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/branches/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await dispatch("fetchBranches");
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    // Fetch courses
    async fetchCourses({ commit }) {
      commit("SET_ERROR", "");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit("SET_COURSES", res.data.data || []);
      } catch (err) {
        console.error(err);
        commit(
          "SET_ERROR",
          err.response?.data?.message || "Failed to fetch courses"
        );
      }
    },

    // Add course
    async addCourse({ dispatch }, payload) {
      try {
        const token = localStorage.getItem("token");
        await axios.post("/courses", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await dispatch("fetchCourses"); // update dashboard automatically
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    async updateCourse({ commit }, payload) {
      commit("SET_ERROR", "");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`/courses/${payload.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit("UPDATE_COURSE", res.data.data);
      } catch (err) {
        console.error(err);
        commit(
          "SET_ERROR",
          err.response?.data?.message || "Failed to update course"
        );
        throw err;
      }
    },

    // Delete course
    async deleteCourse({ dispatch }, id) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await dispatch("fetchCourses");
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
};
