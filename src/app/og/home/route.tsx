import { ImageResponse } from "next/og";
import { getUrl } from "@/lib/utils";

export const runtime = "edge";

const FONT_RESOURCE_REGEX = /src: url\((.+)\) format\('(opentype|truetype)'\)/;
const HTTP_OK_STATUS = 200;

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(FONT_RESOURCE_REGEX);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === HTTP_OK_STATUS) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const text = title
    ? `Mistral Thing • ${title}`
    : "Mistral Thing • Chat with Mistral";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111",
        fontFamily: "Geist Mono",
        padding: "40px",
        position: "relative",
      }}
    >
      {/** biome-ignore lint/performance/noImgElement: Here on the OG ImageResponse we need to use <img> tags */}
      <img
        alt="Mistral Thing logo"
        height={80}
        src={`${getUrl()}/icon-white.svg`}
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
        }}
        width={80}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          maxWidth: "90%",
        }}
      >
        <span
          style={{
            color: "#EFC17F",
            fontSize: 48,
            flexShrink: 0,
          }}
        >
          *
        </span>
        <h1
          style={{
            fontSize: 48,
            color: "#efefef",
            margin: 0,
            lineHeight: 1.2,
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          {text}
        </h1>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist Mono",
          data: await loadGoogleFont("Geist Mono", text),
          style: "normal",
        },
      ],
    }
  );
}
