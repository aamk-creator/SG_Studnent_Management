import Vue from "vue";
import Vuex from "vuex";
import axios from "../plugins/axios";
import students from "./modules/students"; 
import users from "./modules/users";// only keep students module

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    students,
    users, // admin can manage students
  },

  state: {
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },

  actions: {
    async login({ commit, dispatch }, { email, password }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const res = await axios.post("/login", { email, password });

        if (!res.data.status) {
          commit("SET_ERROR", res.data.message || "Login failed");
          return;
        }

        const token = res.data.token;

        // Save user + token
        localStorage.setItem("token", token);
        commit("SET_USER", res.data.user);
        commit("SET_TOKEN", token);

        // Fetch students after login
        await dispatch("students/fetchStudents", null, { root: true });
      } catch (err) {
        commit("SET_ERROR", err.response?.data?.message || "Login failed");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async logout({ commit }) {
      try {
        await axios.post("/logout");
      } catch (e) {
        console.error("Logout API failed", e);
      } finally {
        localStorage.removeItem("token");
        commit("LOGOUT");
      }
    },

    // Auto-fetch students if token exists (on refresh)
    async autoLogin({ commit, dispatch }) {
      const token = localStorage.getItem("token");
      if (token) {
        commit("SET_TOKEN", token);
        await dispatch("students/fetchStudents", null, { root: true });
      }
    },
  },
});

export default store;
