
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // Using port 8080 for backend
    allowedHosts: [
      'lvh.me',
      '.lvh.me',
      '127.0.0.1.nip.io',
      '.127.0.0.1.nip.io'
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5050", // Backend server on port 5050
        changeOrigin: true,
        secure: false,
        // Ensure content-type is preserved
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add proper headers for JSON API communication
            if (req.url && req.url.includes('/api/auth/')) {
              proxyReq.setHeader('Accept', 'application/json');
              if (req.method === 'POST') {
                proxyReq.setHeader('Content-Type', 'application/json');
              }
            }
            console.log('Sending Request to the Target:', req.method, req.url || '[no url]');
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Log the content type to help with debugging
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url || '[no url]', 
              'Content-Type:', proxyRes.headers['content-type']);
          });
        },
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
