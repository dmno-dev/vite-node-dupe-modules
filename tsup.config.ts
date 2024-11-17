import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [ // Entry point(s)
    'src/index.ts', // main lib
    'src/cli.ts', // cli / executable
  ], 

  dts: true,
  sourcemap: true, // Generate sourcemaps
  treeshake: true, // Remove unused code
  clean: true,
  outDir: 'dist', // Output directory  
  format: ['esm'], // Output format(s)
  splitting: true, // split output into chunks - MUST BE ON! or we get issues with multiple copies of classes and instanceof
  keepNames: true, // stops build from prefixing our class names with `_` in some cases
});
