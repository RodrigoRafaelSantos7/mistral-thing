import { createContext, memo, useContext, useId } from "react";
import type { Components } from "react-markdown";
import { Response } from "@/components/ai-elements/response";
import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

export type MarkdownProps = {
  children: string;
  id?: string;
  className?: string;
  components?: Partial<Components>;
  animated?: boolean;
};

const languageRegex = /language-(\w+)/;
const wordsSplitRegex = /\s+/;
const ANIMATION_DELAY_MS = 1.5;
const WORDS_PER_SEGMENT = 10;

function extractLanguage(className?: string): string {
  if (!className) {
    return "plaintext";
  }

  const match = className.match(languageRegex);

  return match ? match[1] : "plaintext";
}

type MarkdownContextType = {
  animated: boolean;
};

const MarkdownContext = createContext<MarkdownContextType | null>(null);

const useMarkdownContext = () => {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error(
      "useMarkdownContext must be used within a MarkdownProvider"
    );
  }
  return context;
};

const INITIAL_COMPONENTS: Partial<Components> = {
  p({ children, className }) {
    const id = useId();
    const { animated } = useMarkdownContext();

    if (typeof children === "string" && animated) {
      const words = children.split(wordsSplitRegex);
      const segments = words.reduce<string[]>((acc, _cur, idx) => {
        if (idx % WORDS_PER_SEGMENT === 0) {
          const segment = words.slice(idx, idx + WORDS_PER_SEGMENT).join(" ");
          // Add trailing space except for the last segment
          const isLastSegment = idx + WORDS_PER_SEGMENT >= words.length;
          acc.push(isLastSegment ? segment : `${segment} `);
        }
        return acc;
      }, []);
      return (
        <p className={cn(className, "w-full")}>
          {segments.map((segment, idx) => {
            const segmentKey = `${id}-${segment.slice(0, 10)}-${idx}`;
            return (
              <span
                className="fade-segment"
                key={segmentKey}
                style={{
                  animationDelay: `${idx * ANIMATION_DELAY_MS}ms`,
                }}
              >
                {segment}
              </span>
            );
          })}
        </p>
      );
    }
    return <p className={cn(className, "w-full")}>{children}</p>;
  },
  code(props) {
    const isInline =
      !props.node?.position?.start.line ||
      props.node?.position?.start.line === props.node?.position?.end.line;

    if (isInline) {
      return (
        <span className={cn("rounded-sm bg-muted px-1 font-mono text-sm")}>
          {props.children}
        </span>
      );
    }

    const language = extractLanguage(props.className);

    return (
      <CodeBlock>
        <CodeBlockCode
          code={(props.children as string)?.replace("\n```*", "")}
          language={language?.trim() || "plaintext"}
        />
      </CodeBlock>
    );
  },
  pre(props) {
    return props.children;
  },
  a({ href, children }) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  },
};

function MarkdownComponent({
  children,
  className,
  components = INITIAL_COMPONENTS,
  animated = false,
}: MarkdownProps) {
  return (
    <MarkdownContext.Provider value={{ animated }}>
      <Response className={className} components={components}>
        {children}
      </Response>
    </MarkdownContext.Provider>
  );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
