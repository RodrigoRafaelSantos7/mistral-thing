import { createContext, memo, useContext, useId, useMemo } from "react";
import type { Components } from "react-markdown";
import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";
import { Response } from "@/components/ui/response";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Regex patterns defined at top level for performance
const WIKIPEDIA_PATTERN = /\s+[-–—]\s+Wikipedia/i;
const WIKIPEDIA_REPLACE_PATTERN = /\s+/g;
const ARXIV_PATTERN = /arXiv:(\d+\.\d+)/i;
const GITHUB_PATTERN = /(https?:\/\/github\.com\/[^/]+\/[^/\s]+)/i;
const DOI_PATTERN = /doi:(\S+)/i;
const WWW_PATTERN = /^www\./;
const DOMAIN_EXTRACT_PATTERN = /^(?:https?:\/\/)?(?:www\.)?([^/\s]+)/;
const LANGUAGE_PATTERN = /language-(\w+)/;
const WORDS_SPLIT_PATTERN = /\s+/;
const CODE_BLOCK_PATTERN = /\n```*/;
const STD_LINK_REGEX = /\[([^\]]+)\]\(((?:\([^()]*\)|[^()])*)\)/g;
const REF_WITH_URL_REGEX =
  /(?:\[(?:(?:\[?(PDF|DOC|HTML)\]?\s+)?([^\]]+))\]|\b([^.!?\n]+?(?:\s+[-–—]\s+\w+|\s+\([^)]+\)))\b)(?:\s*(?:\(|\[\s*|\s+))(https?:\/\/[^\s)]+)(?:\s*[)\]]|\s|$)/g;
const QUOTED_TITLE_REGEX =
  /"([^"]+)"(?:\s+([^.!?\n]+?)(?:\s+[-–—]\s+(?:[A-Z][a-z]+(?:\.[a-z]+)?|\w+:\S+)))/g;
const RAW_URL_REGEX =
  /(https?:\/\/[^\s]+\.(?:pdf|doc|docx|ppt|pptx|xls|xlsx))\b/gi;
const URL_CLEAN_PATTERN = /[.,;:]+$/;

export type MarkdownProps = {
  children: string;
  id?: string;
  className?: string;
  components?: Partial<Components>;
  animated?: boolean;
};

type CitationSourceConfig = {
  name: string;
  pattern: RegExp;
  urlGenerator: (title: string, source: string) => string | null;
};

const citationSources: CitationSourceConfig[] = [
  {
    name: "Wikipedia",
    pattern: /Wikipedia/i,
    urlGenerator: (title: string, source: string) => {
      const searchTerm =
        `${title} ${source.replace(WIKIPEDIA_PATTERN, "")}`.trim();
      return `https://en.wikipedia.org/wiki/${encodeURIComponent(
        searchTerm.replace(WIKIPEDIA_REPLACE_PATTERN, "_")
      )}`;
    },
  },
  {
    name: "arXiv",
    pattern: /arXiv:(\d+\.\d+)/i,
    urlGenerator: (_: string, source: string) => {
      const match = source.match(ARXIV_PATTERN);
      return match ? `https://arxiv.org/abs/${match[1]}` : null;
    },
  },
  {
    name: "GitHub",
    pattern: /github\.com\/[^/]+\/[^/\s]+/i,
    urlGenerator: (_: string, source: string) => {
      const match = source.match(GITHUB_PATTERN);
      return match ? match[1] : null;
    },
  },
  {
    name: "DOI",
    pattern: /doi:(\S+)/i,
    urlGenerator: (_: string, source: string) => {
      const match = source.match(DOI_PATTERN);
      return match ? `https://doi.org/${match[1]}` : null;
    },
  },
];

const processCitation = (
  title: string,
  source: string
): { text: string; url: string } | null => {
  for (const citationSource of citationSources) {
    if (citationSource.pattern.test(source)) {
      const url = citationSource.urlGenerator(title, source);
      if (url) {
        return {
          text: `${title} - ${source}`,
          url,
        };
      }
    }
  }
  return null;
};

function extractDomain(url: string | undefined): string {
  if (!url) {
    return "";
  }
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(WWW_PATTERN, "");
  } catch {
    // If URL parsing fails, try to extract domain manually
    const match = url.match(DOMAIN_EXTRACT_PATTERN);
    return match ? match[1] : url;
  }
}

function extractLanguage(className?: string): string {
  if (!className) {
    return "plaintext";
  }

  const match = className.match(LANGUAGE_PATTERN);

  return match ? match[1] : "plaintext";
}

const INITIAL_COMPONENTS: Partial<Components> = {
  p({ children, className }) {
    const id = useId();
    const { animated } = useMarkdownContext();

    if (typeof children === "string" && animated) {
      const words = children.split(WORDS_SPLIT_PATTERN);
      const segments = words.reduce<Array<{ content: string; index: number }>>(
        (acc, _cur, idx) => {
          if (idx % 10 === 0) {
            const segment = words.slice(idx, idx + 10).join(" ");
            // Add trailing space except for the last segment
            const segmentWithSpace =
              idx + 10 >= words.length ? segment : `${segment} `;
            acc.push({ content: segmentWithSpace, index: idx / 10 });
          }
          return acc;
        },
        []
      );
      return (
        <p className={cn(className, "w-full")}>
          {segments.map((segment) => (
            <span
              className="fade-segment"
              key={`${id}-${segment.index}`}
              style={{
                animationDelay: `${segment.index * 1.5}ms`,
              }}
            >
              {segment.content}
            </span>
          ))}
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
          code={(props.children as string)?.replace(CODE_BLOCK_PATTERN, "")}
          language={language?.trim() || "plaintext"}
        />
      </CodeBlock>
    );
  },
  pre(props) {
    return props.children;
  },
  a({ href, children }) {
    const { citations } = useMarkdownContext();
    const citationIndex = citations.findIndex(
      (citation) => citation.link === href
    );

    if (citationIndex !== -1) {
      const domain = extractDomain(href);
      return (
        <Tooltip>
          <TooltipTrigger>
            <a
              className="flex items-center rounded-xl bg-muted px-1 text-xs no-underline"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {domain || citationIndex + 1}
            </a>
          </TooltipTrigger>
          <TooltipContent>{citations[citationIndex].text}</TooltipContent>
        </Tooltip>
      );
    }
    return (
      <a href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  },
};

type MarkdownContextType = {
  citations: { text: string; link: string }[];
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

function MarkdownComponent({
  children,
  className,
  components = INITIAL_COMPONENTS,
  animated = false,
}: MarkdownProps) {
  const { citations, processedChildren } = useMemo(() => {
    const citationList: { text: string; link: string }[] = [];
    let processed = children;

    processed = processed.replace(STD_LINK_REGEX, (_, text, url) => {
      citationList.push({ text, link: url });
      return `[${text}](${url})`;
    });

    processed = processed.replace(REF_WITH_URL_REGEX, (_match, ...args) => {
      const [docType, bracketText, plainText, url] = args;
      const text = bracketText || plainText;
      const fullText = docType ? `[${docType}] ${text}` : text;
      const cleanUrl = url.replace(URL_CLEAN_PATTERN, "");

      citationList.push({ text: fullText.trim(), link: cleanUrl });
      return `[${fullText.trim()}](${cleanUrl})`;
    });

    processed = processed.replace(
      QUOTED_TITLE_REGEX,
      (match, title, source) => {
        const citation = processCitation(title, source);
        if (citation) {
          citationList.push({
            text: citation.text.trim(),
            link: citation.url,
          });
          return `[${citation.text.trim()}](${citation.url})`;
        }
        return match;
      }
    );

    processed = processed.replace(RAW_URL_REGEX, (match, url) => {
      const filename = url.split("/").pop() || url;
      const alreadyLinked = citationList.some(
        (citation) => citation.link === url
      );
      if (!alreadyLinked) {
        citationList.push({ text: filename, link: url });
      }
      return match;
    });

    return {
      citations: citationList.filter(
        (citation) => citation.link !== citation.text
      ),
      processedChildren: processed,
    };
  }, [children]);

  return (
    <MarkdownContext.Provider value={{ citations, animated }}>
      <Response className={className} components={components}>
        {processedChildren}
      </Response>
    </MarkdownContext.Provider>
  );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
