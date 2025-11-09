"use client";

import { Globe } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { useSessions } from "@/hooks/use-database";
import { useSession } from "@/hooks/use-session";
import { getUsername } from "@/lib/usernames";
import { UsernameForm } from "@/modules/account/ui/components/username-form";
import { getDeviceIcon } from "@/modules/account/utils/get-device-icon";
import { getDeviceInfo } from "@/modules/account/utils/get-device-info";
import { SessionCard } from "../components/session-card";

const Page = () => {
  const sessions = useSessions();
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  if (!sessions) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <Section description="Update your account details" title="Profile">
        <UsernameForm username={getUsername(session.user)} />
      </Section>
      <Separator />
      <Section description="Manage your sessions" title="Sessions">
        <div className="flex flex-col gap-4">
          {sessions.map((sessionItem) => {
            const isCurrentSession = sessionItem.id === session?.session.id;

            const deviceInfo = sessionItem.userAgent
              ? getDeviceInfo({ userAgent: sessionItem.userAgent })
              : "Unknown device";

            const deviceIcon = sessionItem.userAgent ? (
              getDeviceIcon({ userAgent: sessionItem.userAgent })
            ) : (
              <Globe className="size-4" />
            );

            return (
              <SessionCard
                createdAt={sessionItem.createdAt}
                deviceIcon={deviceIcon}
                deviceInfo={deviceInfo}
                ipAddress={sessionItem.ipAddress ?? "Unknown IP address"}
                isCurrentSession={isCurrentSession}
                key={sessionItem.id}
                token={sessionItem.token}
              />
            );
          })}
        </div>
      </Section>
    </div>
  );
};

export default Page;
