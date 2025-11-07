"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";
import { loggedOutPath } from "@/paths";

export function Anonymous({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useSession();

  if (isPending) {
    return null;
  }

  if (!data) {
    return null;
  }

  if (!data.user.isAnonymous) {
    return null;
  }

  return children;
}

export function NotAnonymous({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useSession();

  if (isPending) {
    return null;
  }

  if (!data) {
    return null;
  }

  if (data.user.isAnonymous) {
    return null;
  }

  return children;
}

export function LogoutDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              // TODO: Check if this is working properly
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push(loggedOutPath());
                  },
                },
              });
            }}
            variant="destructive"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RevokeSessionDialog({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Revoke Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke this session?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await authClient.revokeSession({ token });
              setOpen(false);
            }}
            variant="destructive"
          >
            Revoke
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
