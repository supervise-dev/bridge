import { bridgeRouter } from "./router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const server = Bun.serve({
  port: Bun.env.SV_BRIDGE_PORT || 3000,
  fetch(request) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
    return fetchRequestHandler({
      endpoint: "/trpc",
      req: request,
      router: bridgeRouter,
      createContext: () => ({}),
    });
  },
});

console.log(`🚀 tRPC server started on http://localhost:${server.port}`);
