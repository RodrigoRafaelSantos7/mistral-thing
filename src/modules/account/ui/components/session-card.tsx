"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { Activity } from "react";
import { Button } from "@/components/ui/button";
import { LogoutDialog } from "@/modules/account/ui/components/logout-dialog";
import { RevokeSessionDialog } from "@/modules/account/ui/components/revoke-session-dialog";

type SessionCardProps = {
  isCurrentSession: boolean;
  ipAddress: string;
  createdAt: Date;
  token: string;
  deviceIcon: React.ReactNode;
  deviceInfo: string;
};

const SessionCard = ({
  isCurrentSession,
  ipAddress,
  createdAt,
  token,
  deviceIcon,
  deviceInfo,
}: SessionCardProps) => (
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
          <Activity mode={ipAddress ? "visible" : "hidden"}>
            <div className="flex items-center gap-1">
              <MapPin className="size-3" />
              <span>{ipAddress}</span>
            </div>
          </Activity>
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>

    <Activity mode={isCurrentSession ? "hidden" : "visible"}>
      <RevokeSessionDialog token={token}>
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

export { SessionCard };
