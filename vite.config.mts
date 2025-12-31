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
  build: {
    rollupOptions: {
      /**
       * Ignore "use client" waning since we are not using SSR, solution from:
       *  https://github.com/TanStack/query/pull/5161#issuecomment-1477389761
       *  https://github.com/vitejs/vite/issues/15012#issuecomment-1815854072
       */
      onwarn(warning, warn) {
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE'
          && warning.message.includes(`"use client"`)
        ) {
          return;
        }
        warn(warning);
      },
      onLog(level, log, handler) {
        if (log.cause && log.cause.message === `Can't resolve original location of error.`) {
          return;
        }
        handler(level, log);
      },
    },
  },
});
