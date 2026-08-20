import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built as a relative-path bundle so it works no matter what
// subpath the Hugo site is served from (e.g. /blog/tools/guardian/).
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../../static/tools/guardian",
    emptyOutDir: true,
  },
});
