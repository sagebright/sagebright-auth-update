
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Use esbuild for minification instead of terser
    minify: 'esbuild',
    // Reduce chunk size
    chunkSizeWarningLimit: 800,
    // Use rollup for better code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui'],
        },
      },
    },
    // Generate source maps for easier debugging
    sourcemap: mode !== 'production',
  },
  // Set css optimization
  css: {
    // Add postcss processing
    postcss: {
      plugins: [],
    },
    // Enable CSS code splitting
    modules: {
      scopeBehaviour: 'local',
    },
  },
}));
