"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2Icon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import z from "zod";
import { DynamicImage } from "@/components/app/dynamic-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThreadsByTimeRange } from "@/hooks/use-chats-by-time-range";
import { useThreadSession } from "@/lib/threads-store/session/provider";
import { useThreads } from "@/lib/threads-store/threads/provider";
import type { Thread } from "@/lib/threads-store/threads/utils";
import { cn } from "@/lib/utils";
import { indexPath, threadPath } from "@/paths";

export function AppSidebar() {
  const [threadToEdit, setThreadToEdit] = useState<Thread | null>(null);
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <AppSidebarActions />
        <AppSidebarChats
          setThreadToDelete={setThreadToDelete}
          setThreadToEdit={setThreadToEdit}
        />
      </SidebarContent>
      <AppSidebarKeyboardShortcuts />
      <EditChatTitleDialog
        setThreadToEdit={setThreadToEdit}
        thread={threadToEdit}
      />
      <DeleteChatDialog
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
            alt="Mistral Thing"
            className="size-6"
            darkSrc="/icon-white.svg"
            height={100}
            lightSrc="/icon.svg"
            width={100}
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
                <span className="flex-1">New Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AppSidebarKeyboardShortcuts() {
  const router = useRouter();
  const currentThreadId = useThreadSession();
  const { threads } = useThreads();

  const onHandleKeyDown = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a keyboard shortcut handler
    (e: KeyboardEvent) => {
      const isMeta = navigator.platform.toLowerCase().includes("mac")
        ? e.metaKey
        : e.ctrlKey;
      if (e.shiftKey && isMeta && (e.key === "o" || e.key === "O")) {
        e.preventDefault();
        e.stopPropagation();
        router.push(indexPath());
        return;
      }
      if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        e.stopPropagation();

        if (threads.length === 0) {
          return;
        }

        const currentIndex = threads.findIndex(
          (thread) => thread._id === currentThreadId.threadId
        );

        let nextIndex: number;
        if (e.key === "ArrowUp") {
          nextIndex = currentIndex <= 0 ? threads.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex >= threads.length - 1 ? 0 : currentIndex + 1;
        }

        const nextThread = threads[nextIndex];
        if (nextThread) {
          router.push(threadPath(nextThread.slug));
        }
      }
    },
    [threads, currentThreadId, router]
  );

  useEffect(() => {
    const activeEl = document.querySelector(
      '[data-thread-active="true"]'
    ) as HTMLElement | null;
    if (!activeEl) {
      return;
    }

    const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
      let parent = el?.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const hasScrollableContent = parent.scrollHeight > parent.clientHeight;
        const overflowY = style.overflowY;
        if (
          hasScrollableContent &&
          (overflowY === "auto" || overflowY === "scroll")
        ) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return (document.scrollingElement as HTMLElement) ?? null;
    };

    const container = getScrollParent(activeEl);
    if (!container) {
      return;
    }

    const isFullyVisible = () => {
      const elRect = activeEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return (
        elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom
      );
    };

    if (!isFullyVisible()) {
      activeEl.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onHandleKeyDown);
    return () => document.removeEventListener("keydown", onHandleKeyDown);
  }, [onHandleKeyDown]);

  return null;
}

function AppSidebarChats({
  setThreadToEdit,
  setThreadToDelete,
}: {
  setThreadToEdit: (thread: Thread | null) => void;
  setThreadToDelete: (thread: Thread | null) => void;
}) {
  const { threads } = useThreads();
  const groups = useThreadsByTimeRange(threads);

  return (
    <Fragment>
      <ThreadGroup
        label="Today"
        setThreadToDelete={setThreadToDelete}
        setThreadToEdit={setThreadToEdit}
        threads={groups.today}
      />
      <ThreadGroup
        label="Yesterday"
        setThreadToDelete={setThreadToDelete}
        setThreadToEdit={setThreadToEdit}
        threads={groups.yesterday}
      />
      <ThreadGroup
        label="Last 30 Days"
        setThreadToDelete={setThreadToDelete}
        setThreadToEdit={setThreadToEdit}
        threads={groups.lastThirtyDays}
      />
      <ThreadGroup
        label="History"
        setThreadToDelete={setThreadToDelete}
        setThreadToEdit={setThreadToEdit}
        threads={groups.history}
      />
      <p className="p-4 text-muted-foreground/50 text-sm">
        You've reached the end of your threads.
      </p>
    </Fragment>
  );
}

function ThreadGroup({
  threads,
  label,
  setThreadToEdit,
  setThreadToDelete,
}: {
  threads: Thread[];
  label: string;
  setThreadToEdit: (thread: Thread) => void;
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
              setThreadToEdit={setThreadToEdit}
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
  setThreadToEdit,
  setThreadToDelete,
}: {
  thread: Thread;
  setThreadToEdit: (thread: Thread) => void;
  setThreadToDelete: (thread: Thread) => void;
}) {
  const currentThreadId = useThreadSession().threadId;
  const router = useRouter();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div className="group/thread-item relative">
          <Link
            className={cn(
              "absolute inset-0 flex w-full items-center gap-2 rounded-md px-2",
              currentThreadId === thread._id &&
                "data-thread-active='true' bg-muted"
            )}
            href={threadPath(thread.slug)}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.button === 0) {
                router.push(threadPath(thread.slug));
              }
            }}
          >
            <span className="flex-1 truncate">{thread.title}</span>
            {(thread.status === "streaming" ||
              thread.status === "submitted") && (
              <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
            )}
          </Link>
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex w-full items-center justify-end gap-2 rounded-r-md bg-linear-to-l from-sidebar to-transparent px-4 opacity-0 transition-all duration-100 group-hover/thread-item:opacity-100" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex translate-x-full items-center justify-end gap-2 rounded-r-lg px-2 opacity-0 transition-all duration-100 group-hover/thread-item:pointer-events-auto group-hover/thread-item:translate-x-0 group-hover/thread-item:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="size-6 hover:bg-transparent hover:text-primary"
                  onClick={() => setThreadToEdit(thread)}
                  size="icon"
                  variant="ghost"
                >
                  <PencilIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Chat Title</TooltipContent>
            </Tooltip>
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
              <TooltipContent>Delete Chat</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

const editChatTitleSchema = z.object({
  title: z.string().min(1).max(200),
});

function EditChatTitleDialog({
  thread,
  setThreadToEdit,
}: {
  thread: Thread | null;
  setThreadToEdit: (thread: Thread | null) => void;
}) {
  const { updateThread } = useThreads();
  const form = useForm({
    defaultValues: {
      title: thread?.title ?? "",
    },
    validators: {
      onMount: editChatTitleSchema,
      onChange: editChatTitleSchema,
      onSubmit: editChatTitleSchema,
    },
    onSubmit: ({ value }) => {
      if (!thread) {
        return;
      }

      updateThread({
        id: thread._id,
        title: value.title,
      });
      setThreadToEdit(null);
    },
  });

  return (
    <Dialog onOpenChange={() => setThreadToEdit(null)} open={!!thread}>
      <DialogContent
        className="gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="border-foreground/10 border-b bg-sidebar p-6">
          <DialogTitle>Edit Chat Title</DialogTitle>
          <DialogDescription>Edit the title of the chat.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 bg-background px-6 py-4">
            <div className="grid gap-2">
              <form.Field
                name="title"
                validators={{
                  onChange: ({ value }) => {
                    if (value.length === 0) {
                      return "Title is required";
                    }
                    if (value.length > 100) {
                      return "Title must be less than 100 characters";
                    }
                  },
                }}
              >
                {(field) => (
                  <>
                    <Label>Title</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    />
                    {field.state.meta.errors ? (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </>
                )}
              </form.Field>
            </div>
          </div>
          <DialogFooter className="border-foreground/10 border-t bg-sidebar px-6 py-4">
            <Button
              onClick={() => setThreadToEdit(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button
                  disabled={!canSubmit || isSubmitting}
                  onClick={() => form.handleSubmit()}
                  type="submit"
                >
                  {isSubmitting && (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  )}
                  <span>Save</span>
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteChatDialog({
  thread,
  setThreadToDelete,
}: {
  thread: Thread | null;
  setThreadToDelete: (thread: Thread | null) => void;
}) {
  const { removeThread } = useThreads();
  const { threadId } = useThreadSession();
  const router = useRouter();

  function handleDelete() {
    if (!thread) {
      return;
    }
    removeThread({ id: thread._id });
    if (threadId === thread._id) {
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
