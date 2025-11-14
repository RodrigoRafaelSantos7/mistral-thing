import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCodeHighlighter } from "@/hooks/use-code-highlighter";
import { cn } from "@/lib/utils";

export type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-0 min-w-full flex-col overflow-clip border",
        "rounded-xl border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type CodeBlockCodeProps = {
  code: string;
  language?: string;
  theme?: string;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlockCode({
  code,
  language = "tsx",
  theme = "css-variables",
  className,
  ...props
}: CodeBlockCodeProps) {
  const [isCopied, setIsCopied] = useState(false);

  const { highlightedCode } = useCodeHighlighter({
    codeString: code,
    language,
    shouldHighlight: true,
  });

  function handleCopy() {
    if (isCopied) {
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }

  const classNames = cn("w-full overflow-x-auto", className);

  const content = useMemo(() => {
    if (!code?.trim()) {
      return <pre className="px-4" />;
    }

    if (!highlightedCode) {
      return (
        <pre className="px-4 py-0! font-mono">
          <code>{code}</code>
        </pre>
      );
    }

    return (
      <div
        className="px-4"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: This is a valid use case
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    );
  }, [highlightedCode, code]);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between gap-2 border-b p-2">
        <div className="text-muted-foreground text-sm">{language}</div>
        <Button
          className="h-6 w-6 rounded-lg hover:bg-sidebar/50"
          onClick={handleCopy}
          size="sm"
          variant="ghost"
        >
          {isCopied ? (
            <Check className="size-3" />
          ) : (
            <Copy className="size-3" />
          )}
        </Button>
      </div>

      <div className={classNames} {...props}>
        <div className="py-4 text-[13px] [&>pre]:px-4 [&>pre]:py-4">
          {content}
        </div>
      </div>
    </div>
  );
}

export { CodeBlockCode, CodeBlock };
