import type React from "react";
import { lazy, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MarkdownProps } from "@/components/ui/markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const isSSR = typeof window === "undefined";

const getPreloadedMarkdown = () => {
  if (isSSR) {
    return null;
  }
  return (
    (
      window as {
        __preload_markdown?: { default: React.ComponentType<MarkdownProps> };
      }
    ).__preload_markdown?.default || null
  );
};

const LazyMarkdown = isSSR
  ? (_: MarkdownProps) => null
  : lazy(async () =>
      import("@/components/ui/markdown").then((m) => ({
        default: m.Markdown,
      }))
    );

const Markdown = isSSR
  ? (_: MarkdownProps) => null
  : (props: MarkdownProps) => {
      const [preloadedComponent, setPreloadedComponent] =
        useState(getPreloadedMarkdown);

      useEffect(() => {
        const preloaded = getPreloadedMarkdown();
        if (preloaded && !preloadedComponent) {
          setPreloadedComponent(() => preloaded);
        }
      }, [preloadedComponent]);

      if (preloadedComponent) {
        const PreloadedMarkdown = preloadedComponent;
        return <PreloadedMarkdown {...props} />;
      }

      return <LazyMarkdown {...props} />;
    };

export type MessageProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const Message = ({ children, className, ...props }: MessageProps) => (
  <div className={cn("flex gap-3", className)} {...props}>
    {children}
  </div>
);

export type MessageAvatarProps = {
  src: string;
  alt: string;
  fallback?: string;
  delayMs?: number;
  className?: string;
};

const MessageAvatar = ({
  src,
  alt,
  fallback,
  delayMs,
  className,
}: MessageAvatarProps) => (
  <Avatar className={cn("h-8 w-8 shrink-0", className)}>
    <AvatarImage alt={alt} src={src} />
    {fallback && <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>}
  </Avatar>
);

export type MessageContentProps = {
  children: React.ReactNode;
  markdown?: boolean;
  className?: string;
  animated?: boolean;
} & React.ComponentProps<typeof Markdown> &
  React.HTMLProps<HTMLDivElement>;

const MessageContent = ({
  children,
  markdown = false,
  animated = false,
  className,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "min-w-full whitespace-normal break-words rounded-lg",
    className
  );

  return markdown ? (
    <Markdown className={classNames} {...props} animated={animated}>
      {children as string}
    </Markdown>
  ) : (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

export type MessageActionsProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageActions = ({
  children,
  className,
  ...props
}: MessageActionsProps) => (
  <div
    className={cn("flex items-center gap-2 text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
);

export type MessageActionProps = {
  className?: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
} & React.ComponentProps<typeof Tooltip>;

const MessageAction = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: MessageActionProps) => (
  <TooltipProvider>
    <Tooltip {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={className} side={side}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageActions,
  MessageAction,
};
