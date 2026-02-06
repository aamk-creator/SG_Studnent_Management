import axios from "../../plugins/axios";

export default {
  namespaced: true,
  state: {
    users: [],
    loading: false,
    error: null,
  },
  getters: {
    users: (state) => state.users,
    totalUsers: (state) => state.users.length,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    ADD_USER(state, user) {
      state.users.unshift(user);
    },
    REMOVE_USER(state, id) {
      state.users = state.users.filter((u) => u.id !== id);
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_ERROR(state, value) {
      state.error = value;
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      commit("SET_LOADING", true);
      try {
        const res = await axios.get("/users");
        commit("SET_USERS", res.data.users || []);
      } catch (err) {
        commit("SET_ERROR", err.response?.data?.message || "Failed to fetch users");
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async addUser({ commit }, payload) {
      commit("SET_LOADING", true);
      try {
        const res = await axios.post("/users", payload);
        commit("ADD_USER", res.data.user);
        return res.data.user;
      } catch (err) {
        commit("SET_ERROR", err.response?.data?.message || "Failed to add user");
        throw err;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async deleteUser({ commit }, id) {
      try {
        await axios.delete(`/users/${id}`);
        commit("REMOVE_USER", id);
      } catch (err) {
        commit("SET_ERROR", err.response?.data?.message || "Failed to delete user");
      }
    },
  },
};
