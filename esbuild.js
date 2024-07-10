import 'dotenv/config'
import * as esbuild from 'esbuild'
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss'

const context = await esbuild.context({
  entryPoints: ['src/client/index.js', 'src/client/index.html'],
  bundle: true,
  sourcemap: true,
  outdir: './dist',
  loader: { '.js': 'jsx', '.html': 'copy', '.css': 'css' },
  plugins: [tailwindPlugin({})],
})

if (process.env.NODE_ENV === 'development') {
  await context.watch()
} else {
  process.exit()
}
