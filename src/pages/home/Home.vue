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

    <v-row class="mt-0">
      <v-col cols="12" sm="4" md="3" class="history-container">
        <History :historyList="historyList" />
      </v-col>

      <v-col cols="12" sm="8">
        <div v-if="preloader" class="d-flex align-center justify-center h-100 bg-color">
          <v-progress-circular indeterminate :size="48"></v-progress-circular>
        </div>

        <div v-else>
          <depth-chart :data="depthSnapshot" :width="depthChartWidth" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  import DepthChart from "@/components/DepthChart.vue";
  import History from "@/components/History.vue";

  export default {
    name: "OrderBook",

    components: { DepthChart, History },

    data() {
      return {
        currentSymbol: "BTCUSDT",
        symbolList: [
          { title: "BTC / USDT", value: "BTCUSDT" },
          { title: "BNB / BTC", value: "BNBBTC" },
          { title: "ETH / BTC", value: "ETHBTC" },
        ],

        historyList: [],

        preloader: true,
      };
    },

    mounted() {
      this.loadDepth();
    },

    computed: {
      ...mapGetters(["depthSnapshot"]),
    },

    methods: {
      setChangedSymbol() {
        this.loadDepth();

        const date = new Date();
        const { title } = this.symbolList.find((smbl) => smbl.value === this.currentSymbol);
        const setZero = (date) => (date > 9 ? date : "0" + date);
        const hour = setZero(date.getHours());
        const min = setZero(date.getMinutes());
        const second = setZero(date.getSeconds());
        const timestamp = `${hour}:${min}:${second}`;

        this.historyList.unshift({ title, timestamp });
      },
      loadDepth() {
        this.preloader = true;

        this.$store.dispatch("getDepthSnapshot", this.currentSymbol).then(() => {
          if (this.preloader)
            setTimeout(() => {
              this.preloader = false;
            }, 2000);
        });
      },
    },
  };
</script>
