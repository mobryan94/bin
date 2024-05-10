export default {
  install: (app, options) => {
    app.mixin({
      data() {
        return {
          innerWidths: window.innerWidth,
        };
      },

      mounted() {
        window.addEventListener("resize", this.updateWidth);
      },

      computed: {
        isDesktop() {
          return this.innerWidths > 1024;
        },
        isMobile() {
          return this.innerWidths <= 1024;
        },
        isPhone() {
          return this.innerWidths <= 767;
        },
        depthChartWidth() {
          const calcWidth = this.innerWidths - 275;
          return calcWidth > 400 ? calcWidth + "px" : "400px";
        },
      },

      methods: {
        updateWidth() {
          this.innerWidths = window.innerWidth;
        },
      },
    });
  },
};
