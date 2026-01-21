import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/app/api/trpc/router";
import { createTRPCContext } from "@/app/api/trpc/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  });

export { handler as GET, handler as POST };


