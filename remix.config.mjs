// @ts-check
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  serverBuildTarget: "cloudflare-workers",
  server: "./server.ts",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: [".*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // devServerPort: 8002
};

