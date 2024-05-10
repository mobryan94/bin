import { createHtmlPlugin } from "vite-plugin-html";
import { defineConfig } from "vite";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import envCompatible from "vite-plugin-env-compatible";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/fake-binance/",

  assetsInclude: ["**.PNG", "**.SVG"],

  plugins: [
    vue(),
    viteCommonjs(),
    envCompatible(),
    createHtmlPlugin({
      inject: {
        data: { title: "fake-binance" },
      },
    }),
  ],

  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
});
