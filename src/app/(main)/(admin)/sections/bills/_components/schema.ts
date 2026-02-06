import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Bill = RouterOutputs["bills"]["list"][number];
