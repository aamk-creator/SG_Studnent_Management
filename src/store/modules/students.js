
import axios from "axios";

export default {
  namespaced: true,

  state: {
  students: [],
  courses: [],
  branches: [],
  page: 1,
  perPage: 10,
},

getters: {
  allStudents: (state) => state.students,
  allCourses: (state) => state.courses,
  allBranches: (state) => state.branches,

  totalStudents: (state) => state.students.length,

  pageCount: (state) =>
    Math.ceil(state.students.length / state.perPage),

  paginatedStudents: (state) => {
    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    return state.students.slice(start, end);
  },
},

mutations: {
  SET_STUDENTS(state, students) {
    state.students = students;
  },
  ADD_STUDENT(state, student) {
    state.students.unshift(student);
  },
  SET_PAGE(state, page) {
    state.page = page;
  },
},


  actions: {
    
    async fetchStudents({ commit }) {
      try {
        const res = await axios.get("/api/students");
        commit("SET_STUDENTS", res.data.data); 
      } catch (e) {
        console.error("Fetch students failed:", e);
      }
    },

    async addStudent({ commit }, payload) {
      try {
        const res = await axios.post("/api/students", payload);
        const newStudent = res.data.data;
        commit("ADD_STUDENT", newStudent);
        return newStudent;
      } catch (e) {
        console.error("Add student failed:", e);
        throw e;
      }
    },

    async deleteStudent({ commit }, id) {
      try {
        await axios.delete(`/api/students/${id}`);
        commit("REMOVE_STUDENT", id);
      } catch (e) {
        console.error("Delete student failed:", e);
        throw e;
      }
    },

    /* ---------- Courses ---------- */
    async fetchCourses({ commit }) {
      try {
        const res = await axios.get("/api/courses");
        commit("SET_COURSES", res.data.data || []);
      } catch (e) {
        console.error("Fetch courses failed:", e);
      }
    },

    /* ---------- Branches ---------- */
    async fetchBranches({ commit }) {
      try {
        const res = await axios.get("/api/branches");
        commit("SET_BRANCHES", res.data.data || []);
      } catch (e) {
        console.error("Fetch branches failed:", e);
      }
    },
  },
};
