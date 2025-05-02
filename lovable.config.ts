
import { defineConfig } from 'lovable';

export default defineConfig({
  proxies: [
    {
      from: '/api',
      to: 'https://sagebright-backend.up.railway.app/api',
      secure: true,
      rewrite: path => path,
    },
  ],
});
