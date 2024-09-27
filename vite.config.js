import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(),
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
