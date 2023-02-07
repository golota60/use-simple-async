import { defineConfig } from "tsup";

export default defineConfig({
  name: "use-simple-async",
  format: ["cjs", "esm"],
  sourcemap: true,
  treeshake: true,
  dts: true,
  entry: ["src/index.ts"],
});
