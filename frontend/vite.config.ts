import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite";

// https://vitejs.dev/config/
export default async ({ mode }: UserConfig) => {
  // @ts-expect-error - Vite does not have types for this
  import.meta.env = loadEnv(mode, process.cwd());
  await import("./src/env");

  const __dirname = fileURLToPath(new URL(".", import.meta.url));

  return defineConfig({
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      viteReact(),
      tailwindcss(),
    ],
    server: {
      port: 3000,
    },
    test: {
      globals: true,
      environment: "jsdom",
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  });
};
