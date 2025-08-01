// https://vitejs.dev/config/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  base: '/elden-ring-weapon-calculator/',
  plugins: [react(), eslint()],
  build: {
    outDir: "build",
  },
});
