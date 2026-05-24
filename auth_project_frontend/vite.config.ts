import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // ✅ Aceita conexões externas
    port: 5173,
    strictPort: true,
    hmr: {
      host: "localhost", // ✅ Para desenvolvimento local
      port: 5173,
      protocol: "http",
    },
  },
});
