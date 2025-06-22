/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import progress from "vite-plugin-progress";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

import picocolors from "picocolors";
import { visualizer } from "rollup-plugin-visualizer";

import tailwindcss from "@tailwindcss/vite";

const ENV_PREFIX = "ENV_";

// const httpsOptions: ServerOptions = {
//   pfx: readFileSync("cert/zeroKeystore.pfx"),
//   passphrase: "123456",
// };

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIX);
  const base = env.ENV_APP_BASE_URL;
  const { bold, green, cyan } = picocolors;

  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      svgr({
        include: "**/*.svg",
      }),
      {
        ...visualizer(),
        apply: "build",
      },
      progress({
        format: `${green(bold("Building"))} ${cyan("[:bar]")} :percent`,
      }),
      nodePolyfills(),

      // @see https://github.com/liuweiGL/vite-plugin-mkcert
      // provide temp certificate(just in dev) to support for vite https development services
      // if an Axios request error is reported during startup
      // comment out this line and release[basicSsl()]'s comment to provide temp certificate
      mkcert({ source: "coding" }),
      // @see https://vitejs.dev/config/server-options.html#server-https
      // basicSsl(),
    ],
    envPrefix: ENV_PREFIX,
    optimizeDeps: {
      exclude: ["react-scan"],
    },
    server: {
      open: true,
      port: 3000,
      host: true,
      cors: true,
      // proxy: {
      //   "/api": {
      //     target: "http://localhost:8080",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //     configure: (proxy, options) => {
      //       proxy.on("proxyReq", (proxyReq, req, res) => {
      //         proxyReq.removeHeader("Referer");
      //         proxyReq.removeHeader("origin");
      //       });
      //     },
      //   },
      // },
    },
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: "./src/test/setup.ts",
    },
    base: base,
    build: {
      // outDir: "dist",
      // sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
  };
});
