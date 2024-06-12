import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  vitePlugin: {
    onwarn: (warning, defaultHandler) => {
      console.log('svelte:warnings:%s', JSON.stringify(warning));
      defaultHandler(warning);
    },
  }
};
