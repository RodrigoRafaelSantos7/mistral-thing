"use client";

import type { ImageProps } from "next/image";
import Image from "next/image";
import { useTheme } from "next-themes";
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
  const isDarkMode = theme?.includes("dark");

  if (isDarkMode) {
    return (
      <Image alt={alt} className={cn(className)} src={darkSrc} {...props} />
    );
  }

  return (
    <Image alt={alt} className={cn(className)} src={lightSrc} {...props} />
  );
};

export { DynamicImage };
