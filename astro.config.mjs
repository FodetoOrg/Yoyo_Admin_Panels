// @ts-check
import { defineConfig } from 'astro/config';
import deno from '@astrojs/deno';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  adapter: deno({}),
  output: "server",
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});