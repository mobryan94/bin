import { createRouter, createWebHistory } from "vue-router";

import * as layouts from "@/layouts";
import * as pages from "@/pages";

const routes = [
  {
    component: layouts.Default,
    path: "/fake-binance",
    children: [
      {
        path: "",
        name: "home",
        component: pages.home.Home,
      },
      {
        path: "order-book",
        name: "order-book",
        component: pages.orderBook.OrderBook,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

export default router;
