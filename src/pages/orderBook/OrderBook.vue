<template>
  <div>
    <div class="d-flex align-center">
      <span class="mr-3">Записей в таблице: </span>
      <v-select v-model="currentItems" :items="itemsPerPage" class="mt-4 symbols-container" density="compact"></v-select>
    </div>

    <v-row style="max-height: 80vh; overflow: auto">
      <v-col>
        <span> Bids </span>
        <v-data-table
          :headers="headers"
          :items="$store.getters.depthSnapshot.bids"
          :items-per-page="currentItems"
          :items-per-page-options="itemsPerPage"
          items-per-page-text=""
          hide-default-footer
          no-data-text="Loading..."
        ></v-data-table>
      </v-col>

      <v-col>
        <span> Asks </span>
        <v-data-table
          :headers="headers"
          :items="$store.getters.depthSnapshot.asks"
          :items-per-page="currentItems"
          :items-per-page-options="itemsPerPage"
          items-per-page-text=""
          hide-default-footer
          no-data-text="Loading..."
        ></v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: "OrderBook",

    data() {
      return {
        currentItems: 10,

        itemsPerPage: [
          { value: 10, title: "10" },
          { value: 100, title: "100" },
          { value: 1000, title: "1000" },
        ],
      };
    },

    mounted() {},

    computed: {
      headers() {
        let headerList = [
          { title: "Price", key: "0" },
          { title: "Total", key: "3" },
        ];

        if (!this.isPhone) {
          headerList.splice(1, 0, { title: "Quantity", key: "1" });
        }

        return headerList;
      },
    },

    methods: {},
  };
</script>

<style></style>
