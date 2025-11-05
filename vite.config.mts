import path from 'node:path';
import { defineConfig } from 'vite';

import RubyPlugin from 'vite-plugin-ruby';

export default defineConfig({
  resolve: {
    alias: {
      '@views': path.resolve(__dirname, 'app/views'),
      '@javascript': path.resolve(__dirname, 'app/javascript'),
    },
  },
  plugins: [RubyPlugin()],
});
