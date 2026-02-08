import type { RouterOutputs } from "@/app/api/trpc/react";

export type Bill = RouterOutputs["bills"]["list"][number];
