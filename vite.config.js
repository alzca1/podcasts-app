import { defineConfig } from "vite"
import react from '@vitejs/plugin-react'


//https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps:{
//     esbuildOptions:{
//       loader: {
//         '.js': 'jsx',
//       }
//     }
//   },
//   test: {
//     globals: true, 
//     environment: 'jsdom',
//     setupFiles: './src/__tests__/setup.js'
//   }
// })


 import fs from 'fs/promises';

export default defineConfig(() => ({
  test: {
    globals: true, 
     environment: 'jsdom',
     setupFiles: './src/__tests__/setup.js'
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    // loader: "tsx",
    // include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: await fs.readFile(args.path, "utf8"),
            }));
          },
        },
      ],
    },
  },
})); 