<template>
  <v-dialog v-model="modal.dialog" max-width="300">
    <v-card class="pa-3 modal_content">
      <v-card-text class="text-center">{{ modal.message }}</v-card-text>

      <v-row class="d-flex flex-column align-center">
        <v-col class="d-flex flex-column" cols="5">
          <v-btn color="primary" @click="confirmed">Ок</v-btn>
          <v-btn @click="cancel">Отмена</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    emits: ["duplicate", "confirmed", "cancel"],

    data() {
      return {
        modal: {
          dialog: false,
          entities: [],
          entity_id: "",
          entity_name: "",
          message: "",
          type: "",
          ym_goal: "",
        },
      };
    },

    methods: {
      setEntity(entity_id, message, ym_goal = "", type = "") {
        this.modal.entity_id = entity_id;
        this.modal.message = message;
        this.modal.ym_goal = ym_goal;
        this.modal.type = type;

        this.getModal();
      },
      getModal() {
        this.modal.dialog = true;
      },
      confirmed() {
        if (this.modal.type === "duplicate") {
          this.$store.dispatch("setRoom", { id: this.modal.entity_id }).then((room) => {
            this.$emit("duplicate", room);
          });
        } else {
          this.$emit("confirmed", { entity_id: this.modal.entity_id, ym_goal: this.modal.ym_goal });
        }

        this.modal.dialog = false;
      },
      cancel() {
        this.$emit("cancel", this.modal.ym_goal);
        this.modal.dialog = false;
      },
    },
  };
</script>
