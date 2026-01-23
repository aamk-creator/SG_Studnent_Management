import axios from "@/plugins/axios";

export default {
  namespaced: true,

  state: {
    certificates: [],
  },

  getters: {
    certificateCount: (state) => state.certificates.length,
  },

  mutations: {
    SET_CERTIFICATES(state, certificates) {
      state.certificates = certificates;
    },
  },

  actions: {
    async fetchMyCertificates({ commit }) {
      const res = await axios.get("/student/certificates");
      commit("SET_CERTIFICATES", res.data);
    },
  },
};
