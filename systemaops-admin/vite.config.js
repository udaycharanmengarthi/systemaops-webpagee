import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served behind the reverse proxy at /admin/ (proxy_pass preserves the
// prefix; BrowserRouter uses basename "/admin"). Dev server on :5174 so
// it never collides with the public site (:5173) or the API (:5000).
export default defineConfig({
  plugins: [react()],
  base: "/admin/",
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "es2020",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
});
