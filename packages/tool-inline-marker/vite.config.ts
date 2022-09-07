import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      formats: ['es', 'cjs'],
      fileName: (format) => `${format}.js`,
    },
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: false,
  },
});
