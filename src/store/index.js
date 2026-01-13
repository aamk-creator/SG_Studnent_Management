import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

axios.defaults.baseURL = "http://127.0.0.1:8000/api";

// ✅ Load token on refresh
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default new Vuex.Store({
  state: {
    user: null,
    token: token || null,
    loading: false,
    error: null,
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
    },
  },

  actions: {
    async login({ commit }, {email,password}) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      console.log(email,password)
      try {
        const res = await axios.post("/login", {email,password});

        const token = res.data.token;

        commit("SET_USER", res.data.user);
        commit("SET_TOKEN", token);

        // ✅ Persist token
        localStorage.setItem("token", token);

        // ✅ Set auth header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        commit(
          "SET_ERROR",
          err.response?.data?.message || "Login failed"
        );
      } finally {
        commit("SET_LOADING", false);
      }
    },

    logout({ commit }) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      commit("LOGOUT");
    },
  },
});
