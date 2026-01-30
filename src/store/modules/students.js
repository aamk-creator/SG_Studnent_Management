import axios from "../../plugins/axios";

export default {
  namespaced: true,
  state: {
    students: [],
    page: 1,
    perPage: 10,
    loading: false,
    error: "",
  },

  getters: {
    students: (state) => state.students,
  },

  mutations: {
    SET_STUDENTS(state, students) {
      // Add showPassword toggle for UI
      state.students = students.map((s) => ({ ...s, showPassword: false }));
    },
    ADD_STUDENT(state, student) {
      state.students.unshift({ ...student, showPassword: false });
    },
    UPDATE_STUDENT(state, updated) {
      const index = state.students.findIndex((s) => s.id === updated.id);
      if (index !== -1) state.students.splice(index, 1, { ...updated, showPassword: false });
    },
    REMOVE_STUDENT(state, id) {
      state.students = state.students.filter((s) => s.id !== id);
    },
  },

  actions: {
    async fetchStudents({ commit }) {
      try {
        const res = await axios.get("/students");
        commit("SET_STUDENTS", res.data.data || []);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async addStudent({ commit }, payload) {
      const res = await axios.post("/students", payload);
      commit("ADD_STUDENT", res.data.data);
    },
    async updateStudent({ commit }, student) {
      const res = await axios.put(`/students/${student.id}`, student);
      commit("UPDATE_STUDENT", res.data.data);
    },
    async deleteStudent({ commit }, id) {
      await axios.delete(`/students/${id}`);
      commit("REMOVE_STUDENT", id);
    },
  },
};
