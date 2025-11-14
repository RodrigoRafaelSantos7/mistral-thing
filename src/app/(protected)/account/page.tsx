"use client";

import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Globe,
  Laptop,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Activity } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { LogoutDialog, RevokeSessionDialog } from "@/components/app/auth";
import { SingleFieldForm } from "@/components/app/single-field-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

const getDeviceInfo = ({ userAgent }: { userAgent: string }) => {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const parts: string[] = [];

  if (browser.name) {
    parts.push(browser.name);
  }
  if (os.name) {
    parts.push(os.name);
  }
  if (device.model) {
    parts.push(device.model);
  }

  return parts.join(" • ") || "Unknown device";
};

const getDeviceIcon = ({ userAgent }: { userAgent: string }) => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();

  if (device.type === "mobile") {
    return <Smartphone className="size-4" />;
  }
  if (device.type === "tablet") {
    return <Tablet className="size-4" />;
  }
  if (os.name === "Mac OS") {
    return <Laptop className="size-4" />;
  }
  if (os.name === "Windows") {
    return <Monitor className="size-4" />;
  }
  if (os.name === "Linux") {
    return <Monitor className="size-4" />;
  }
  return <Globe className="size-4" />;
};

type SessionItemProps = {
  sessionItem: {
    id: string;
    token: string;
    userAgent?: string | null | undefined;
    ipAddress?: string | null | undefined;
    createdAt: number | Date;
  };
  currentSessionId: string | undefined;
};

const SessionItem = ({ sessionItem, currentSessionId }: SessionItemProps) => {
  const isCurrentSession = sessionItem.id === currentSessionId;

  const deviceInfo = sessionItem.userAgent
    ? getDeviceInfo({ userAgent: sessionItem.userAgent })
    : "Unknown device";

  const deviceIcon = sessionItem.userAgent ? (
    getDeviceIcon({ userAgent: sessionItem.userAgent })
  ) : (
    <Globe className="size-4" />
  );

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
        isCurrentSession
          ? "border-primary/20 bg-primary/10"
          : "border-foreground/10 bg-muted/50 hover:bg-muted/80"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-md ${
            isCurrentSession
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {deviceIcon}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-sm">{deviceInfo}</span>
            <Activity mode={isCurrentSession ? "visible" : "hidden"}>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-primary text-xs">
                Current
              </span>
            </Activity>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <Activity mode={sessionItem.ipAddress ? "visible" : "hidden"}>
              <div className="flex items-center gap-1">
                <MapPin className="size-3" />
                <span>{sessionItem.ipAddress}</span>
              </div>
            </Activity>
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>
                {formatDistanceToNow(new Date(sessionItem.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Activity mode={isCurrentSession ? "hidden" : "visible"}>
        <RevokeSessionDialog token={sessionItem.token}>
          <Button
            className="text-muted-foreground hover:text-destructive"
            size="sm"
            variant="ghost"
          >
            <span>Revoke</span>
          </Button>
        </RevokeSessionDialog>
      </Activity>

      <Activity mode={isCurrentSession ? "visible" : "hidden"}>
        <LogoutDialog>
          <Button
            className="text-muted-foreground hover:text-destructive"
            size="sm"
            variant="ghost"
          >
            <span>Logout</span>
          </Button>
        </LogoutDialog>
      </Activity>
    </div>
  );
};

const Page = () => {
  const session = authClient.useSession();

  const allSessions = useQuery(api.auth.listSessions);
  const isAllSessionsPending = allSessions === undefined;

  return (
    <div className="flex w-full flex-col gap-8">
      <Section description="Update your account details" title="Profile">
        {session.isPending ? (
          <UsernameFormSkeleton />
        ) : (
          <SingleFieldForm
            defaultValue={session.data?.user.name ?? ""}
            description="What do you want to be called?"
            footerMessage="Please use 32 characters or less."
            label="Username"
            onSubmit={async (value) => {
              await authClient.updateUser({
                name: value,
              });
              toast.success("Username updated");
            }}
            renderInput={({ onChange, value }) => (
              <Input onChange={(e) => onChange(e.target.value)} value={value} />
            )}
          />
        )}
      </Section>
      <Separator />
      <Section description="Manage your sessions" title="Sessions">
        <div className="flex flex-col gap-4">
          {isAllSessionsPending ? (
            <SessionsSkeleton />
          ) : (
            allSessions?.map((sessionItem) => (
              <SessionItem
                currentSessionId={session?.data?.session.id}
                key={sessionItem.id}
                sessionItem={sessionItem}
              />
            ))
          )}
        </div>
      </Section>
    </div>
  );
};

const UsernameFormSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
    <div className="flex items-center justify-between border-t bg-sidebar p-4">
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-8 w-14 rounded-md" />
    </div>
  </div>
);

const SessionsSkeleton = () => (
  <>
    {[1, 2].map((i) => (
      <div
        className="flex items-center justify-between rounded-lg border border-foreground/10 bg-muted/50 p-4"
        key={i}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    ))}
  </>
);

export default Page;
