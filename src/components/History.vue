<template>
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
</template>

<script>
  export default {
    props: {
      historyList: Array,
    },
  };
</script>
