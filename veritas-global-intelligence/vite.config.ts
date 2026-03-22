import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Merge process.env with loaded env for maximum coverage
  const mergedEnv = { ...process.env, ...env };
  
  const geminiKey = mergedEnv.GEMINI_API_KEY || mergedEnv.API_KEY || mergedEnv.VITE_GEMINI_API_KEY || '';
  const mapsKey = mergedEnv.GOOGLE_MAPS_PLATFORM_KEY || mergedEnv.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
  const newsKey = mergedEnv.NEWS_API_KEY || mergedEnv.VITE_NEWS_API_KEY || '';
  const twitterToken = mergedEnv.TWITTER_BEARER_TOKEN || mergedEnv.VITE_TWITTER_BEARER_TOKEN || '';
  const grokKey = mergedEnv.GROK_API_KEY || mergedEnv.VITE_GROK_API_KEY || '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
      'process.env.API_KEY': JSON.stringify(geminiKey),
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(mapsKey),
      'process.env.NEWS_API_KEY': JSON.stringify(newsKey),
      'process.env.TWITTER_BEARER_TOKEN': JSON.stringify(twitterToken),
      'process.env.GROK_API_KEY': JSON.stringify(grokKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
