// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
// https://astro.build/config
export default defineConfig({
  site: "https://hunterportfolio.pages.dev",
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["lunter.king-gecko.ts.net"],
    },
  },
  integrations: [
    expressiveCode({
      themes: ["github-dark"],
      styleOverrides: {
        borderRadius: "0.5rem",
        borderColor: "#374151",
        codeFontFamily: "'IBM Plex Mono', monospace",
        codeBackground: "#1f2937",
        frames: {
          frameBoxShadowCssValue: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
      },
    }),
    mdx(),
  ],
  adapter: cloudflare({
    imageService: "compile",
  }),
});