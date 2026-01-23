import axios from "@/plugins/axios";

export default {
  namespaced: true,

  state: {
    student: null,
    token: localStorage.getItem("student_token") || null,
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    studentName: (state) => state.student?.name || "",
  },

  mutations: {
    SET_STUDENT(state, student) {
      state.student = student;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
    },
    LOGOUT(state) {
      state.student = null;
      state.token = null;
      delete axios.defaults.headers.common["Authorization"];
    },
  },

  actions: {
    async loginStudent({ commit }, credentials) {
      try {
        const res = await axios.post("/student/login", credentials);
        const token = res.data.token;
        commit("SET_TOKEN", token);
        localStorage.setItem("student_token", token);

        commit("SET_STUDENT", res.data.student);
        return true;
      } catch (err) {
        console.error("Login failed:", err.response?.data || err);
        throw err;
      }
    },

    async fetchStudentProfile({ commit }) {
      try {
        const res = await axios.get("/student/me");
        commit("SET_STUDENT", res.data.data); // assuming backend returns { data: student }
      } catch (err) {
        console.error("Fetch profile failed:", err.response?.data || err);
      }
    },

    logoutStudent({ commit }) {
      localStorage.removeItem("student_token");
      commit("LOGOUT");
    },
  },
};

// --- Initialization ---
// Set token on app start
const token = localStorage.getItem("student_token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
