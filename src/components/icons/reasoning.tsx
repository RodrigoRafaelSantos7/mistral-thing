import type { SVGProps } from "react";

export function Reasoning(props: SVGProps<SVGSVGElement>) {
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
      <title>Reasoning</title>
      <g clipPath="url(#_S_3_)" fill="currentColor">
        <path d="M12.8.5H3.2v3.286h9.6V.5ZM3.2 3.785H0v9.857h3.2V3.785ZM6.4 20.214V23.5h3.2v-3.286h3.2v-6.571H9.6v-3.286H6.4v3.286H3.2v6.571h3.2ZM16 3.785h-3.2v9.857H16V3.785Z" />
      </g>
      <defs>
        <clipPath id="_S_3_">
          <path d="M0 .5h16v23H0z" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
}
