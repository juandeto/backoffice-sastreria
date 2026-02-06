import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Session = RouterOutputs["sessions"]["list"][number];
