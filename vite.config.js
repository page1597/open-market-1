import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({
  base: "/open-market-service/",
  build: {
    rollupOptions: {
      input: {
        header: resolve(__dirname, "header.html"),
        main: resolve(__dirname, "index.html"),
        cart: resolve(__dirname, "cart.html"),
        login: resolve(__dirname, "login.html"),
        product: resolve(__dirname, "product.html"),
        footer: resolve(__dirname, "footer.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
