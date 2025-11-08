import { Spinner } from "@/components/ui/spinner";

const Loading = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <Spinner />
  </div>
);

export { Loading };
