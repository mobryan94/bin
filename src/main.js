import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "@/plugins/vuetify.js";

import mixinResize from "@/mixins/resize";

import "./assets/app.css";

let app = createApp(App);
app.use(mixinResize).use(router).use(store).use(vuetify);
app.mount("#app");
