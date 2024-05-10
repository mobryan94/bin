<template>
  <v-container fluid>
    <div>
      <depth-chart :data="data" :options="options" :theme="theme" />
    </div>

    <v-btn @click="stopWs">STOP</v-btn>

    <!-- <OrderInfo ref="orderInfo" @saveChanges="refreshAbonementOrders" /> -->
  </v-container>
</template>

<script>
  import DepthChart from "@/components/DepthChart.vue";

  import axios from "axios";

  export default {
    name: "OrderBook",

    components: { DepthChart },

    data() {
      return {
        options: {
          width: 780,
          height: 540,
          tipType: "axis",
        },

        theme: "day",

        data: {},

        currWs: null,
      };
    },

    mounted() {
      axios.get("https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=1000").then((response) => {
        console.log(response.data);
        this.data = response.data;

        this.data.asks = this.data.asks.map((ask, indx) => {
          if (indx === 0) {
            ask[1] = +ask[1];
            return ask;
          }

          ask[1] = +ask[1] + +this.data.asks[indx - 1][1];

          return ask;
        });

        this.data.bids = this.data.bids.map((bid, indx) => {
          if (indx === 0) {
            bid[1] = +bid[1];
            return bid;
          }

          bid[1] = +bid[1] + +this.data.bids[indx - 1][1];

          return bid;
        });

        this.data.asks = this.data.asks.reverse();
      });

      // this.currWs = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@depth");

      // this.currWs.onmessage = (event) => {
      //   console.log(event.data);
      // };
    },

    methods: {
      stopWs() {
        this.currWs.close();
      },
    },
  };
</script>

<style></style>
