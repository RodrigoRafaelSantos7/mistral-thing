import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="z-10 flex min-h-screen w-full items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
