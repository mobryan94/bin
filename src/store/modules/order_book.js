import axios from "@/utils/axios";

const state = {
  spheres: [],
  spheresNames: [],
};

const getters = {
  spheres: (state) => state.spheres,
  spheresNames: (state) => state.spheresNames,
};

const actions = {
  setSpheres({ commit }) {
    return axios.get("/api/spheres/search").then((response) => {
      commit("setSpheres", response.data);
      return response.data;
    });
  },
  setSpheresNames({ commit }) {
    return axios.get("/api/spheres/names").then((response) => {
      commit("setSpheresNames", response.data);
      return response.data;
    });
  },
  setSphereOptions({ rootGetters, dispatch }, base_id) {
    if (rootGetters.bases.length && rootGetters.bases.find((base) => base.id === base_id)) {
      const { sphereId } = rootGetters.bases.find((base) => base.id === base_id);

      if (rootGetters.spheres.length) {
        return getSphereOptionsData(rootGetters.spheres, sphereId);
      } else {
        return dispatch("setSpheres").then((spheres) => {
          return getSphereOptionsData(spheres, sphereId);
        });
      }
    } else {
      return dispatch("setBases").then((bases) => {
        const { sphereId } = bases.find((base) => base.id === base_id);

        if (rootGetters.spheres.length) {
          return getSphereOptionsData(rootGetters.spheres, sphereId);
        } else {
          return dispatch("setSpheres").then((spheres) => {
            return getSphereOptionsData(spheres, sphereId);
          });
        }
      });
    }
  },
};

const mutations = {
  setSpheres(state, spheres) {
    state.spheres = spheres;
  },
  setSpheresNames(state, spheresNames) {
    state.spheresNames = spheresNames;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
