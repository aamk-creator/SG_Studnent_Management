import axios from "../../plugins/axios";

export default {
  namespaced: true,
  state: {
    students: [],
    page: 1,
    perPage: 10,
    loading: false,
  },

  getters: {
    students: (state) => state.students,
    totalStudents: (state) => state.students.length,
    pageCount: (state) => Math.ceil(state.students.length / state.perPage),
    paginatedStudents: (state) => {
      const start = (state.page - 1) * state.perPage;
      const end = start + state.perPage;
      return state.students.slice(start, end);
    },
    loading: (state) => state.loading,
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
      if (index !== -1) {
        state.students.splice(index, 1, updated);
      }
    },
    SET_PAGE(state, page) {
      state.page = page;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
  },

  actions: {
    async fetchStudents({ commit }) {
      commit("SET_LOADING", true);
      try {
        const res = await axios.get("/students");
        commit("SET_STUDENTS", res.data.data || []);
      } catch (err) {
        console.error("Fetch students failed", err.response?.data || err);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async addStudent({ commit }, payload) {
      const res = await axios.post("/students", payload);
      commit("ADD_STUDENT", res.data.data);
      commit("SET_PAGE", 1);
      return res.data.data;
    },

    async deleteStudent({ commit }, id) {
      await axios.delete(`/students/${id}`);
      commit("REMOVE_STUDENT", id);
    },

    
    async updateStudent({ commit }, student) {
      try {
        const res = await axios.put(`/students/${student.id}`, student);
        commit("UPDATE_STUDENT", res.data.data); // update Vuex state
        return res.data.data;
      } catch (err) {
        console.error("Update student failed", err.response?.data || err);
        throw err;
      }
    },
  },
};
