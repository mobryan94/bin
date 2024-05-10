<template>
  <div>
    <Header />

    <div class="px-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Header from "@/components/Header";

  export default {
    name: "DefaultLayout",

    components: {
      Header,
    },
  };
</script>
