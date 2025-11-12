import type { SVGProps } from "react";

export function TextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="size-6 text-primary"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Text Icon</title>
      <path d="M12 9.75h4.5V7.5h-9V12H12V9.75Z" fill="currentColor" />
      <path
        d="M5.25 18.75H7.5V16.5H5.25V5.25h13.499v9H7.499v2.25H21V3h-18v18h2.25v-2.25Z"
        fill="currentColor"
      />
    </svg>
  );
}
