"use client";

import { useMutation } from "convex/react";
import { PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, useState } from "react";
import { DynamicImage } from "@/components/app/dynamic-image";
import { AppSidebarKeyboardShortcuts } from "@/components/app/sidebar-keyboard-shortcuts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useThreadsByTimeRange } from "@/hooks/use-chats-by-time-range";
import { useThreads } from "@/hooks/use-database";
import { useParamsThreadId } from "@/hooks/use-params-thread-id";
import { cn } from "@/lib/utils";
import { indexPath } from "@/paths";
import type { Thread } from "@/types/threads";

export function AppSidebar() {
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <AppSidebarActions />
        <AppSidebarThreads setThreadToDelete={setThreadToDelete} />
      </SidebarContent>
      <AppSidebarKeyboardShortcuts />
      <DeleteThreadDialog
        setThreadToDelete={setThreadToDelete}
        thread={threadToDelete}
      />
    </Sidebar>
  );
}

function AppSidebarHeader() {
  return (
    <SidebarHeader className="p-3">
      <Button asChild size="icon" variant="ghost">
        <Link href={indexPath()}>
          <DynamicImage
            alt="Mistral Thing Logo"
            darkSrc="/icon-white.svg"
            height={24}
            lightSrc="/icon.svg"
            width={24}
          />
        </Link>
      </Button>
    </SidebarHeader>
  );
}

function AppSidebarActions() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={indexPath()}>
                <PlusIcon />
                <span className="flex-1">New Thread</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AppSidebarThreads({
  setThreadToDelete,
}: {
  setThreadToDelete: (thread: Thread | null) => void;
}) {
  const threads = useThreads();
  const groups = useThreadsByTimeRange(threads?.page ?? []);

  return (
    <>
      <ThreadGroup
        label="Today"
        setThreadToDelete={setThreadToDelete}
        threads={groups.today}
      />
      <ThreadGroup
        label="Yesterday"
        setThreadToDelete={setThreadToDelete}
        threads={groups.yesterday}
      />
      <ThreadGroup
        label="Last 30 Days"
        setThreadToDelete={setThreadToDelete}
        threads={groups.lastThirtyDays}
      />
      <ThreadGroup
        label="History"
        setThreadToDelete={setThreadToDelete}
        threads={groups.history}
      />
      <p className="p-4 text-muted-foreground/50 text-sm">
        You've reached the end of your threads.
      </p>
    </>
  );
}

function ThreadGroup({
  threads,
  label,
  setThreadToDelete,
}: {
  threads: Thread[];
  label: string;
  setThreadToDelete: (thread: Thread) => void;
}) {
  if (threads.length === 0) {
    return null;
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {threads.map((thread) => (
            <ThreadItem
              key={thread._id}
              setThreadToDelete={setThreadToDelete}
              thread={thread}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ThreadItem({
  thread,
  setThreadToDelete,
}: {
  thread: Thread;
  setThreadToDelete: (thread: Thread) => void;
}) {
  const threadId = useParamsThreadId();
  const router = useRouter();
  const isActive = threadId === thread._id;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div className="group/thread-item relative">
          <Link
            className={cn(
              "absolute inset-0 flex w-full items-center gap-2 rounded-md px-2",
              isActive && "bg-muted"
            )}
            href={`/${thread._id}`}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.button === 0) {
                router.push(`/${thread._id}`);
              }
            }}
          >
            <span className="flex-1 truncate">{thread.title}</span>
            <Activity mode={thread.status === "" ? "visible" : "hidden"}>
              <Spinner />
            </Activity>
          </Link>
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex w-full items-center justify-end gap-2 rounded-r-md bg-linear-to-l from-sidebar to-transparent px-4 opacity-0 transition-all duration-100 group-hover/thread-item:opacity-100" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex translate-x-full items-center justify-end gap-2 rounded-r-lg px-2 opacity-0 transition-all duration-100 group-hover/thread-item:pointer-events-auto group-hover/thread-item:translate-x-0 group-hover/thread-item:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="size-6 hover:text-primary"
                  onClick={() => setThreadToDelete(thread)}
                  size="icon"
                  variant="ghost"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Thread</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function DeleteThreadDialog({
  thread,
  setThreadToDelete,
}: {
  thread: Thread | null;
  setThreadToDelete: (thread: Thread | null) => void;
}) {
  const deleteThreadMutation = useMutation(api.threads.deleteThread);
  const threadId = useParamsThreadId();
  const router = useRouter();

  async function handleDelete() {
    if (!thread) {
      return;
    }

    const result = await deleteThreadMutation({ threadId: thread._id });

    if (result.isDone && threadId === thread._id) {
      router.push(indexPath());
    }

    setThreadToDelete(null);
  }

  return (
    <Dialog onOpenChange={() => setThreadToDelete(null)} open={!!thread}>
      <DialogContent
        className="gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="bg-background p-6">
          <DialogTitle>Delete Thread</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this thread? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="border-foreground/10 border-t bg-sidebar px-6 py-4">
          <Button
            onClick={() => setThreadToDelete(null)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} type="button" variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
