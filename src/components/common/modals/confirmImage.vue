<template>
  <v-dialog :model-value="isConfirm" max-width="500px" persistent>
    <v-card>
      <v-layout align-center column fill-height class="pa-2 modal_content">
        <v-card-title class="headline text-center">Размер изображения не должен превышать 1 мб</v-card-title>
        <v-btn color="primary" @click="closeConfirm">Ок</v-btn>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "confirmImage",

    props: {
      isConfirm: {
        default: false,
        type: Boolean,
      },
    },

    emits: ["closeConfirm"],

    methods: {
      closeConfirm() {
        this.$emit("closeConfirm", this.isConfirm);
      },
    },
  };
</script>
