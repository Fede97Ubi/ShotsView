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
        name: "Vite PWA Project",
        short_name: "Vite PWA Project",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
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
