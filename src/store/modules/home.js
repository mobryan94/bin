import axios from "@/utils/axios";
import qs from "qs";

const actions = {
  setSingupRequest({ dispatch }) {
    return Promise.all([dispatch("setSpheres"), dispatch("setCities")]);
  },
  setSingupDomain({ dispatch }, dataDomain) {
    return axios.post("api/domains/registry", qs.stringify(dataDomain));
  },
};

// const state = {};
// const getters = {};
// const mutations = {};

export default {
  // state,
  // getters,
  actions,
  // mutations,
};
