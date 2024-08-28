import { Glob, type BunPlugin } from "bun";
import { filesize } from "filesize";

export async function build(options: { watch?: boolean, outDir: string, publicPath: string, extraStatus?: string }) {
  let result = await Bun.build({
    entrypoints: ['./src/index.ts', './src/demo/index.ts'],
    outdir: options.outDir,
    loader: {
      ".css": "file",
      ".html": "file",
    },
    naming: {
      asset: "[dir]/[name].[ext]"
    },
    publicPath: options.publicPath || "/",
    splitting: true,
    minify: true,
    sourcemap: 'external'
  })

  if (!result.success) {
    result.logs.forEach(log => console.error(log, '\n\n----\n'));
    console.log("\n❌ ", new Date(), "\n");
    return;
  }

  let items = result.outputs.filter(art => !art.path.endsWith('.map')).map(art => ({
    'name': '📗 .' + art.path.slice(process.cwd().length),
    'loader': art.loader,
    'size': "\x1b[33m" + filesize(art.size) + "\x1b[0m"
  }));

  console.table(items);
  console.log("\n✔️ ", new Date(), options.extraStatus || '', "\n");
}
