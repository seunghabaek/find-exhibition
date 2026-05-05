import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "find-exhibition",
  brand: {
    displayName: "서울 전시회",
    primaryColor: "#3D5AFE",
    icon: "",
  },
  web: {
    host: "192.168.219.104",
    port: 3000,
    commands: {
      dev: "vite --host",
      build: "vite build",
    },
  },
  webViewProps: {
    type: "partner",
  },
  permissions: [],
  outdir: "dist",
});
