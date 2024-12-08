import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
        script-src-elem 'self' 'unsafe-inline' https://apis.google.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://apis.google.com;
        frame-src 'self' https://accounts.google.com https://apis.google.com;
      `.replace(/\s+/g, ' ').trim()
    }
  }
  // ... other config options
}); 