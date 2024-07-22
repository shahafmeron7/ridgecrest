import { defineConfig,loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import envCompatible from "vite-plugin-env-compatible";
import { fileURLToPath, URL } from "node:url";

const productionBaseURL = "/application/";
const developmentBaseURL = "/";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(),'');
console.log(env)
  // const isProduction =env.NODE_ENV === 'production';
  // console.log(isProduction)
  // const base = isProduction ? productionBaseURL : developmentBaseURL
const base = env.VITE_BASE_URL || "/";


  return {
    envPrefix: "VITE_",
    // This changes the out put dir from dist to build
    // comment this out if that isn't relevant for your project

    base,
    build: {
      outDir: "build",
      sourcemap: false,
      minify: true,
      cssMinify: true,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[hash].js`,
          chunkFileNames: `assets/[hash].js`,
          assetFileNames: `assets/[hash].[ext]`,
        },
      },
    },
    server: {
      open: true,
      port:6006
    },
    plugins: [
      react(),
      envCompatible(),
      svgrPlugin({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: "**/*.svg",
        // ...svgr options (https://react-svgr.com/docs/options/)
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
