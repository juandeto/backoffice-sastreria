import { appRouter } from "./router";
import { createTRPCContext } from "./context";


export async function getServerCaller() {
  const headers = new Headers();
  const ctx = await createTRPCContext({ headers });
  return appRouter.createCaller(ctx);
}
