"use client";

import type { ImageProps } from "next/image";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type DynamicImageProps = Omit<ImageProps, "src" | "className"> & {
  lightSrc: ImageProps["src"];
  darkSrc: ImageProps["src"];
  className?: string;
};

const DynamicImage = ({
  lightSrc,
  darkSrc,
  alt,
  className,
  ...props
}: DynamicImageProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && theme?.includes("dark");
  const src = isDarkMode ? darkSrc : lightSrc;

  return <Image alt={alt} className={cn(className)} src={src} {...props} />;
};

export { DynamicImage };
