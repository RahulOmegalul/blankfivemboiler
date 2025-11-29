import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

const isWatch = process.argv.includes('--watch');

if (existsSync('dist')) {
  rmSync('dist', { recursive: true, force: true });
}

console.log('Building project...');
const buildOptions = [
  {
    name: 'Client',
    entryPoints: ['src/client/src/client.ts'],
    outfile: 'dist/client/client.js',
    platform: 'browser',
  },
];

async function build() {
  try {
    const buildPromises = buildOptions.map(async (options) => {
      const context = await esbuild.context({
        entryPoints: options.entryPoints,
        outfile: options.outfile,
        bundle: true,
        platform: options.platform,
        target: 'es2020',
        format: 'iife',
        logLevel: 'info',
        minify: false,
        sourcemap: false,
        external: [],
      });

      if (isWatch) {
        await context.watch();
        console.log(`${options.name} build is watching for changes...`);
      } else {
        await context.rebuild();
        await context.dispose();
        console.log(`${options.name} build completed.`);
      }
    });

    await Promise.all(buildPromises);

    console.log('\n📦 Building Web UI...');
    execSync('cd ./src/web && npm run build', { stdio: 'inherit' });
    console.log('✅ Web UI built successfully');

    if (!isWatch) {
      console.log('\nAll builds completed successfully.');
    } else {
      console.log('\nBuilds are watching for changes...');
      console.log('Press Ctrl+C to stop.');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}
build();
