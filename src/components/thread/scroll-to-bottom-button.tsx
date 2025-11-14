"use client";

import type { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ScrollToBottomButtonProps = {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ScrollToBottomButton({
  className,
  variant = "outline",
  size = "sm",
  ...props
}: ScrollToBottomButtonProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    <Button
      className={cn(
        "-top-6 -translate-x-1/2 absolute left-[50%] transition-all duration-150 ease-out",
        isAtBottom
          ? "pointer-events-none translate-y-4 scale-95 opacity-0"
          : "translate-y-0 scale-100 opacity-100",
        className
      )}
      onClick={() => scrollToBottom()}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {props.children || <ChevronDown className="h-5 w-5" />}
    </Button>
  );
}

export { ScrollToBottomButton };
