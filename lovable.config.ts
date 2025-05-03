
import { defineConfig } from 'lovable';

export default defineConfig({
  proxies: [
    {
      from: '/api',
      to: 'https://sagebright-backend.up.railway.app',
      secure: true,
      rewrite: path => path.replace(/^\/api/, ''),
    },
  ],
});
