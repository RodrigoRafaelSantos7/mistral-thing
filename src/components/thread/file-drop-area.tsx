"use client";

import { Activity, useState } from "react";
import { type FileWithPath, useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

type FileDropAreaProps = {
  className?: string;
  onUploadAction: (files: FileList) => Promise<void>;
  children: React.ReactNode;
  overlayText?: string;
};

export function FileDropArea({
  onUploadAction,
  children,
  overlayText = "Drop files here",
  className,
}: FileDropAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = async (accepted: FileWithPath[]) => {
    setIsDragActive(false);
    const dataTransfer = new DataTransfer();
    for (const file of accepted) {
      dataTransfer.items.add(file);
    }
    await onUploadAction(dataTransfer.files);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/plain": [],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn("relative flex flex-1 flex-col", className)}
    >
      <input {...getInputProps()} />

      {children}

      <Activity mode={isDragActive ? "visible" : "hidden"}>
        <div className="absolute inset-0 z-10 flex size-full items-center justify-center rounded-3xl border-none bg-background/50 p-0 backdrop-blur transition-opacity duration-200 ease-out">
          <p className="font-medium text-sm">{overlayText}</p>
        </div>
      </Activity>
    </div>
  );
}
