'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createUser, getUser, getUserByEmail } from '@/lib/db/queries';
import { createClient } from '@/lib/auth/server';
import {
  activityLogs,
  ActivityType,
  NewActivityLog,
  User,
} from '@/lib/db/schema';
import { cookies } from 'next/headers';
import { db } from '@/lib/db/drizzle';
import { SignJWT } from 'jose';

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error, data: authData } = await supabase.auth.signInWithPassword(
    data,
  );

  if (error) {
    redirect('/error');
  }

  if (authData?.user) {
    const sessionData = {
      user: { id: authData.user.id },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    const token = await new SignJWT(sessionData)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(sessionData.expires),
    });
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const userEmail = await getUserByEmail(formData.get('email') as string);

  if (userEmail) {
    redirect('/error?error=email-already-exists');
  }

  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error, data: insertedUser } = await supabase.auth.signUp(data);

  if (error || !insertedUser.user?.email) {
    redirect('/error');
  }

  createUser({
    email: insertedUser.user?.email || '',
    name: insertedUser.user?.user_metadata.name || '',
    createdAt: new Date(),
    updatedAt: new Date(),
    id: insertedUser.user?.id || '',
    role: 'user',
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeProductId: null,
    planName: null,
    subscriptionStatus: null,
    deletedAt: null,
  });

  revalidatePath('/', 'layout');
  redirect('/');
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
    ipAddress: ipAddress || '',
  };
  await db.insert(activityLogs).values(newActivity);
}

export async function signOut() {
  const supabase = await createClient();
  const user = (await getUser()) as User;

  // Log the activity
  await logActivity(user.id, ActivityType.SIGN_OUT);

  // Sign out from Supabase
  await supabase.auth.signOut();

  // Clear the session cookie
  (await cookies()).delete('session');

  // Revalidate all routes
  revalidatePath('/', 'layout');
}

function uuidv4(): string {
  return crypto.randomUUID();
}
