import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import visualizer from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor-leaflet",
              test: /node_modules\/(leaflet|react-leaflet|@react-leaflet)/,
            },
            {
              name: "vendor-query",
              test: /node_modules\/@tanstack/,
            },
            {
              name: "vendor-zod",
              test: /node_modules\/zod/,
            },
          ],
        },
      },
    },
  },
});
