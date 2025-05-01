
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // Use port 8080 as required in the project
    allowedHosts: [
      'lvh.me',
      '.lvh.me',
      '127.0.0.1.nip.io',
      '.127.0.0.1.nip.io'
    ],
    proxy: {
      "/api": {
        target: "http://localhost:8080", // API backend also runs on port 8080
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Maintain original path
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Log proxy requests during development for debugging
            if (mode === 'development' && req.url) {
              console.log(`🔄 Proxying request: ${req.method} ${req.url}`);
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Ensure content-type is set correctly for API responses
            if (req.url && req.url.startsWith('/api/auth')) {
              proxyRes.headers['content-type'] = 'application/json';
              if (mode === 'development') {
                console.log(`✅ Auth response from ${req.url || 'unknown'}: ${proxyRes.statusCode}`);
              }
            }
          });
        }
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
