import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";
import { createClient } from "@/lib/auth/server";
import { createUser, getUserByEmail } from "@/lib/db/queries";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { db } from "@/lib/db/drizzle";
import { activityLogs, ActivityType, NewActivityLog, User } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

function uuidv4(): string {
  return crypto.randomUUID();
}

async function logActivity(
  userId: string,
  type: ActivityType,
  ipAddress?: string,
) {
  const newActivity: NewActivityLog = {
    id: uuidv4(),
    userId,
    action: type,
    ipAddress: ipAddress || "",
  };
  await db.insert(activityLogs).values(newActivity);
}

export const usersRouter = createTRPCRouter({
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email({ message: "Please enter a valid email address." }),
        password: z.string().min(6, { message: "Password must be at least 6 characters." }),
      }),
    )
    .mutation(async ({ input }) => {
      const supabase = await createClient();

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.message || "Invalid email or password",
        });
      }

      if (!authData?.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Authentication failed",
        });
      }

      const sessionData = {
        user: { id: authData.user.id },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      };


      const token = await new SignJWT(sessionData)
        .setProtectedHeader({ alg: "HS256" })
        .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

      (await cookies()).set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(sessionData.expires),
      });

      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      };
    }),

  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email({ message: "Please enter a valid email address." }),
        password: z.string().min(6, { message: "Password must be at least 6 characters." }),
      }),
    )
    .mutation(async ({ input }) => {
      const userEmail = await getUserByEmail(input.email);

      if (userEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }

      const supabase = await createClient();

      const { error, data: insertedUser } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error || !insertedUser.user?.email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to create user",
        });
      }

      await createUser({
        email: insertedUser.user.email,
        name: insertedUser.user.user_metadata.name || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        id: insertedUser.user.id,
        role: "user",
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripeProductId: null,
        planName: null,
        subscriptionStatus: null,
        deletedAt: null,
      });

      return {
        success: true,
        user: {
          id: insertedUser.user.id,
          email: insertedUser.user.email,
        },
      };
    }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    const supabase = await createClient();
    const user = ctx.user as User;

    // Log the activity
    await logActivity(user.id, ActivityType.SIGN_OUT);

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear the session cookie
    (await cookies()).delete("session");

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
});
