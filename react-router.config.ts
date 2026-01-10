import type { Config } from "@react-router/dev/config";

export default {
  future: {
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    unstable_viteEnvironmentApi: true,
    // unstable_middleware: true,
    // unstable_subResourceIntegrity: true,
  },
  routeDiscovery: { mode: "initial" },
} satisfies Config;
