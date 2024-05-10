import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import { ru } from "vuetify/locale";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";

export default createVuetify({
  components: { ...components, ...labsComponents },

  locale: { fallback: "ru", locale: "ru", messages: { ru } },

  defaults: {
    VBtn: {
      rounded: "lg",
      style: "font-size: 14px; margin: 6px !important;",
    },
  },

  directives,

  theme: {
    defaultTheme: "myCustomTheme",
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          background: "#003717",
          accent: "#9c27b0",
          common: "#DCDEDF",
          error: "#f44336",
          info: "#2196f3",
          primary: "#F89623",
          secondary: "#e57373",
          success: "#18A032",
          warning: "#EC2828",
        },
      },
    },
  },
});
