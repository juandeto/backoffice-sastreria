import { db } from "@/lib/db/drizzle";
import { getUser } from "@/lib/db/queries";

export async function createTRPCContext(opts: { headers: Headers }) {
  const user = await getUser();
  return { db, user, headers: opts.headers };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

