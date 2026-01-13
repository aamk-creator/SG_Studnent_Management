import api from "@/services/api"; // axios instance

export default {
  state: {
    students: [],
  },

  getters: {
    students: (state) => state.students,
  },

  mutations: {
    SET_STUDENTS(state, students) {
      state.students = students;
    },
  },

  actions: {
    // 🔹 FETCH
    async fetchStudents({ commit }) {
      const res = await api.get("/students");
      commit("SET_STUDENTS", res.data.data);
    },

    // 🔹 ADD
    async addStudent({ dispatch }, payload) {
      await api.post("/students", payload);
      dispatch("fetchStudents");
    },

    // 🔹 UPDATE
    async updateStudent({ dispatch }, payload) {
      await api.put(`/students/${payload.id}`, payload);
      dispatch("fetchStudents");
    },

    // 🔹 DELETE SINGLE
    async deleteStudent({ dispatch }, id) {
      await api.delete(`/students/${id}`);
      dispatch("fetchStudents");
    },

    // 🔹 DELETE MULTIPLE
    async deleteStudents({ dispatch }, ids) {
      await api.post("/students/bulk-delete", { ids });
      dispatch("fetchStudents");
    },
  },
};
