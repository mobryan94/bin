<template>
  <header class="header-container">
    <div @click="goTo('home')">
      <img class="header-logo" src="@/assets/favicon.png" alt="logo" />
    </div>

    <div>
      <v-btn color="amber-accent-2" variant="text" href="/order-book">Order Book</v-btn>
    </div>
  </header>
</template>

<script>
  export default {
    name: "Header",

    methods: {
      goTo(link) {
        this.$router.push({ name: link });
      },
    },
  };
</script>
