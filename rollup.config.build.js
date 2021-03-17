import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import legacy from "@rollup/plugin-legacy";
import css from "rollup-plugin-css-only";
import pkg from "./package.json";

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: "src/index.js",
  output: [
    { file: pkg.module, format: "es" },
    { file: pkg.main, format: "umd", name },
  ],
  plugins: [
    legacy({
      "node_modules/panzoom/index.js": "panzoom",
    }),
    svelte(),
    resolve(),
    css({ output: "bundle.css" }),
  ],
};
