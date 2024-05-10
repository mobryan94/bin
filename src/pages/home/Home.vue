<template>
  <div>
    <v-row>
      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="currentSymbol"
          :items="symbolList"
          class="mt-4 symbols-container"
          density="compact"
          @update:modelValue="setChangedSymbol"
        ></v-select>
      </v-col>
    </v-row>

    <v-row class="mt-0" :class="isPhone ? 'flex-column-reverse' : ''">
      <v-col cols="12" sm="4" md="3" class="history-container">
        <div class="d-flex justify-space-between">
          <div>Валюта</div>
          <div class="pr-5">Время</div>
        </div>

        <hr />

        <div class="overflow-auto pr-2">
          <div v-for="(hstr, hstrIndx) in historyList" :key="hstrIndx" class="history-item">
            <div>{{ hstr.title }}</div>
            <div>{{ hstr.timestamp }}</div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="8">
        <div v-if="preloader" class="d-flex align-center justify-center h-100" style="background-color: #093e1f">
          <v-progress-circular indeterminate :size="48"></v-progress-circular>
        </div>

        <div v-else>
          <depth-chart :data="data" :width="depthChartWidth" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import axios from "axios";
  import DepthChart from "@/components/DepthChart.vue";

  export default {
    name: "OrderBook",

    components: { DepthChart },

    data() {
      return {
        data: {},

        preloader: true,
        currWs: null,

        currentSymbol: "BTCUSDT",
        symbolList: [
          { title: "BTC / USDT", value: "BTCUSDT" },
          { title: "BNB / BTC", value: "BNBBTC" },
          { title: "ETH / BTC", value: "ETHBTC" },
        ],

        historyList: [],
      };
    },

    mounted() {
      axios.get("https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=1000").then((response) => {
        this.data = response.data;

        const myWorker = new Worker(new URL("./depth.js", import.meta.url));
        const depthDataCopy = JSON.parse(JSON.stringify(this.data));
        const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@depth");

        ws.onmessage = (wsData) => {
          const wsDataCopy = JSON.parse(JSON.stringify(wsData.data));

          myWorker.postMessage([depthDataCopy, wsDataCopy]);
          myWorker.onmessage = (e) => {
            this.$nextTick(() => {
              this.data = e.data;
              this.preloader = false;
            });
          };
        };
      });
    },

    methods: {
      setChangedSymbol() {
        const date = new Date();
        const { title } = this.symbolList.find((smbl) => smbl.value === this.currentSymbol);
        const setZero = (date) => (date > 9 ? date : "0" + date);
        const hour = setZero(date.getHours());
        const min = setZero(date.getMinutes());
        const second = setZero(date.getSeconds());
        const timestamp = `${hour}:${min}:${second}`;

        this.historyList.unshift({ title, timestamp });
      },
    },
  };
</script>
