import { watch } from "fs";
import { parseArgs } from "util";
import { build } from "./build";
import { serveContent } from "./server";

const defaultOutDir = './build';
const commands = {
  build: (values: any) => {
    build(values);
    if (values.watch) {
      runOnChanges('./src', () => build(values));
    }
  },
  run: (values: any) => {
    let server = serveContent(values.outDir);
    values.extraStatus = `🪐 ${server.url}`;
    build(values);
    runOnChanges('./src', () => build(values));
  },
};

let { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    watch: {
      type: 'boolean',
    },
    outDir: {
      type: 'string',
      default: './build',
    }
  },
  strict: true,
  allowPositionals: true,
});

function exitWithUsage() {
  console.log("### Usage ###");
  console.log("> bun scripts/start.ts <command> [options]");

  console.log("\n### Commands ###");
  console.log("  build · build the project");
  console.log("  run  · serve the project and watch for changes");

  console.log("\n### Options ###");
  console.log("  --watch  · watch for changes in the src and reload");
  console.log(`  --outDir · output directory for building (default: ${defaultOutDir})`);

  console.log("\n### ENV Options ###");
  console.log("  PORT · port for serving content");

  console.log("");
  process.exit(1);
}

// Main ///
let command = (commands as any)[positionals[positionals.length - 1]];
if (!command) {
  exitWithUsage();
}
command(values);

// Helpers
function runOnChanges(dir: string, callback: (values: any) => void) {
  process.on("SIGINT", () => {
    console.log("👍\n");
    watcher.close();
    process.exit(0);
  });

  let last = Date.now();
  let watcher = watch(dir, { recursive: true }, (event, filename) => {
    let now = Date.now();
    if (now - last < 500) return;
    callback(values);
    last = now;
  });
}