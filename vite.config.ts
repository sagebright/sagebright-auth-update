
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5050, // Reverted frontend dev server to port 5050 as requested
    allowedHosts: [
      'lvh.me',
      '.lvh.me',
      '127.0.0.1.nip.io',
      '.127.0.0.1.nip.io'
    ],
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Backend server at 8080 as expected
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
