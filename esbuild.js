import 'dotenv/config'
import * as esbuild from 'esbuild'
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss'

const config = {
  entryPoints: ['src/client/index.js', 'src/client/index.html'],
  bundle: true,
  sourcemap: true,
  outdir: './dist',
  loader: { '.js': 'jsx', '.html': 'copy', '.css': 'css' },
  plugins: [tailwindPlugin({})],
}

if (process.env.NODE_ENV === 'development') {
  const context = await esbuild.context(config)
  await context.watch()
} else {
  await esbuild.build(config)
  process.exit()
}
