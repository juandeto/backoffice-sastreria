"use client";

import { use, useEffect } from "react";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils/utils";
import { useUser } from "@/lib/auth";
import { useRouter } from 'next/navigation';
import { api } from "@/app/api/trpc/react";

export function AccountSwitcher({
  users,
}: {
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
    readonly role: string;
  }>;
}) {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/auth/v1/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // Find the current user in the mock users list to get the avatar
  const currentUserMock = users.find((u) => u.email === user.email);
  const avatarUrl = currentUserMock?.avatar || "/default_avatar.svg";
  const signOutMutation = api.users.signOut.useMutation();

  async function handleSignOut() {
    await signOutMutation.mutateAsync();
    router.refresh();
    router.replace('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg cursor-pointer">
          <AvatarImage src={avatarUrl} alt={user.name || ""} />
          <AvatarFallback className="rounded-lg">{user?.email || "User"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem className={cn("p-0 border-l-2 border-l-primary bg-accent/50")}>
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={avatarUrl} alt={user?.email || ""} />
              <AvatarFallback className="rounded-lg">{user?.email || "User"}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.email}</span>
              <span className="truncate text-xs capitalize text-muted-foreground">{user.role}</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
