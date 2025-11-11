"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { FileDropArea } from "@/components/thread/file-drop-area";
import { useThreadSelector } from "@/context/thread";
import { useUploadThing } from "@/lib/uploadthing";
import type { FileAttachment } from "@/thread/store";

export function ThreadContainer({ children }: { children: React.ReactNode }) {
  const attachments = useThreadSelector((state) => state.attachments);
  const setPendingFileCount = useThreadSelector(
    (state) => state.setPendingFileCount
  );
  const setAttachments = useThreadSelector((state) => state.setAttachments);

  const attachmentsRef = useRef(attachments);
  attachmentsRef.current = attachments;

  const onBeforeUploadBegin = useCallback(
    (files: File[]) => {
      setPendingFileCount((prev) => prev + files.length);
      return files;
    },
    [setPendingFileCount]
  );

  const onClientUploadComplete = useCallback(
    (files: Array<{ ufsUrl: string; name: string; type: string }>) => {
      setPendingFileCount((prev) => prev - files.length);
      const newAttachments: FileAttachment[] = files.map((file) => ({
        type: "file" as const,
        url: file.ufsUrl,
        filename: file.name,
        mediaType: file.type,
      }));
      setAttachments([...attachmentsRef.current, ...newAttachments]);
    },
    [setPendingFileCount, setAttachments]
  );

  const onUploadError = useCallback(
    (error: Error) => {
      toast.error(error.message);
      setPendingFileCount((prev) => prev - 1);
    },
    [setPendingFileCount]
  );

  const { startUpload } = useUploadThing("fileUploader", {
    onBeforeUploadBegin,
    onClientUploadComplete,
    onUploadError,
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    await startUpload(Array.from(files));
  };

  return (
    <FileDropArea onUploadAction={handleFileUpload}>{children}</FileDropArea>
  );
}
