"use client";

import {
  Clock,
  Globe,
  Laptop,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import {
  LogoutDialog,
  NotAnonymous,
  RevokeSessionDialog,
} from "@/components/app/auth";
import { SingleFieldForm } from "@/components/app/single-field-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useListSessions } from "@/hooks/use-list-sessions";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";
import { getUsername } from "@/lib/usernames";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * HOURS_PER_DAY;

const Page = () => {
  const { data: session } = useSession();
  const { sessions: activeSessions, isLoading } = useListSessions();

  const getDeviceIcon = (userAgent: string) => {
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

  const getDeviceInfo = (userAgent: string) => {
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

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / MILLISECONDS_PER_DAY);
    const hours = Math.floor(diff / MILLISECONDS_PER_HOUR);
    const minutes = Math.floor(diff / MILLISECONDS_PER_MINUTE);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    return "Just now";
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <title>Account | Mistral Thing</title>
      <Section description="Update your account details" title="Profile">
        <SingleFieldForm
          defaultValue={getUsername(session?.user)}
          description="What do you want to be called?"
          footerMessage="Please use 32 characters or less."
          label="Username"
          onSubmit={async (value) => {
            if (!session?.user) {
              return;
            }
            await authClient.updateUser({
              name: value,
            });
            toast.success("Username updated");
          }}
          renderInput={({ onChange, value }) => (
            <Input onChange={(e) => onChange(e.target.value)} value={value} />
          )}
        />
      </Section>
      <Separator />
      <Section description="Manage your sessions" title="Sessions">
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-between rounded-lg border border-foreground/10 bg-muted/50 p-4">
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
            </div>
          ) : (
            // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a list of sessions (TODO: Refactor into Smaller Components)
            activeSessions.map((sessionItem) => {
              const isCurrentSession = sessionItem.id === session?.session.id;
              const deviceInfo = sessionItem.userAgent
                ? getDeviceInfo(sessionItem.userAgent)
                : "Unknown device";
              const deviceIcon = sessionItem.userAgent ? (
                getDeviceIcon(sessionItem.userAgent)
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
                  key={sessionItem.id}
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
                        <span className="truncate font-medium text-sm">
                          {deviceInfo}
                        </span>
                        {isCurrentSession && (
                          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-primary text-xs">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground text-xs">
                        {sessionItem.ipAddress && (
                          <div className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            <span>{sessionItem.ipAddress}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>
                            {formatDate(new Date(sessionItem.createdAt))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isCurrentSession && (
                    <RevokeSessionDialog token={sessionItem.token}>
                      <Button
                        className="text-muted-foreground hover:text-destructive"
                        size="sm"
                        variant="ghost"
                      >
                        <span>Revoke</span>
                      </Button>
                    </RevokeSessionDialog>
                  )}

                  <NotAnonymous>
                    {isCurrentSession && (
                      <LogoutDialog>
                        <Button
                          className="text-muted-foreground hover:text-destructive"
                          size="sm"
                          variant="ghost"
                        >
                          <span>Logout</span>
                        </Button>
                      </LogoutDialog>
                    )}
                  </NotAnonymous>
                </div>
              );
            })
          )}
        </div>
      </Section>
    </div>
  );
};

export default Page;
