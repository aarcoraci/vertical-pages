import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/vertical-swiping-ui/',
  // optimizeDeps: { exclude: ['swiper/vue', 'swiper/types'] },
  css: {
    preprocessorOptions: {
      scss: {
        // example : additionalData: `@import "./src/design/styles/variables";`
        // dont need include file extend .scss
        additionalData: `
        @import "./src/assets/scss/partials/_colors.scss";
        @import "./src/assets/scss/partials/_breakpoints.scss";
        @import "./src/assets/scss/partials/_typography.scss";
        @import "./src/assets/scss/partials/_mixins.scss";
        `
      }
    }
  }
});
