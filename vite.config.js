import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        description: "testmanifest",
        theme_color: "#aaafff",
        name: "ShotsView",
        short_name: "Short-ShotsView",
        icons: [
          {
            src: "shotsview-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "shotsview-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "shotsview-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
            label: "screnshot test wide",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "narrow",
            label: "screnshot test narrow",
          },
        ],
      },
    }),
    // {
    //   manifest: {
    //     description: "testmanifest",
    //     theme_color: "#aaafff",
    //     icons: [
    //       {
    //         src: "src/icon/icon-512x512.png",
    //         size: "512x512",
    //         type: "image/png",
    //         purpose: "any",
    //       },
    //       {
    //         src: "src/icon/icon-192x192.png",
    //         size: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: ({ url }) => url.pathname.startsWith('/api'),
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'api-cache',
    //           cacheableResponse: {
    //             statuses: [200],
    //           }
    //         }
    //       }
    //     ]
    //   }
    // }
  ],
});
