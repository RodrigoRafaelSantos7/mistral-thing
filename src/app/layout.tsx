import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Mistral Thing",
    template: "%s | Mistral Thing",
  },
  metadataBase: new URL("https://mistral-thing.xyz"),
  description:
    "Mistral Thing is a sleek and modern AI chat application. It allows you to interact with large language models from Mistral",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: [
    "Mistral Thing",
    "AI Chat",
    "AI Chat Application",
    "AI Chat Application with Mistral AI",
  ],
  authors: [
    {
      name: "Rodrigo Santos",
      url: "https://rodrigosantos.dev",
    },
  ],
  creator: "@rrcssantosdev",
  openGraph: {
    type: "website",
    locale: "en",
    url: "https://mistral-thing.xyz",
    title: "Mistral Thing",
    description:
      "Mistral Thing is a sleek and modern AI chat application. It allows you to interact with large language models from Mistral",
    siteName: "Mistral Thing",
    images: ["https://mistral-thing.xyz/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mistral Thing",
    description:
      "Mistral Thing is a sleek and modern AI chat application. It allows you to interact with large language models from Mistral",
    images: ["https://mistral-thing.xyz/og"],
    creator: "@rrcssantosdev",
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSerif.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
