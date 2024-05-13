import axios from "axios";

const state = {
  currWs: null,
  depthSnapshot: [],
};

const getters = {
  currWs: (state) => state.currWs,
  depthSnapshot: (state) => state.depthSnapshot,
};

const actions = {
  async getDepthSnapshot({ commit, dispatch, rootGetters }, symbol) {
    const response = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=1000`);
    commit("setDepthSnapshot", response.data);

    const updateDepthData = new Worker(new URL("@/worker/depth.js", import.meta.url));
    const depthDataCopy = JSON.parse(JSON.stringify(response.data));

    dispatch("getWs", symbol.toLocaleLowerCase());

    let lastUpdate = null;
    let firstGet = true;

    rootGetters.currWs.onmessage = (wsData) => {
      const wsDataCopy = JSON.parse(JSON.stringify(wsData.data));
      if (JSON.parse(wsDataCopy).u <= depthDataCopy.lastUpdateId) return;
      if (!lastUpdate) lastUpdate = wsDataCopy;
      if (firstGet || JSON.parse(lastUpdate).u + 1 === JSON.parse(wsDataCopy).U) {
        firstGet = false;
        lastUpdate = wsDataCopy;

        updateDepthData.postMessage([depthDataCopy, wsDataCopy]);
        updateDepthData.onmessage = (result) => {
          return commit("setDepthSnapshot", result.data);
        };
      }
    };
  },
  getWs({ commit, rootGetters }, symbol) {
    if (rootGetters.currWs) rootGetters.currWs.close();
    commit("setWs", new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth`));
  },
};

const mutations = {
  setDepthSnapshot(state, depthSnapshot) {
    state.depthSnapshot = depthSnapshot;
  },
  setWs(state, currWs) {
    state.currWs = currWs;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
