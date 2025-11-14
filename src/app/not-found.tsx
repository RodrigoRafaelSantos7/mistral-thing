import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { indexPath } from "@/paths";

export const metadata: Metadata = {
  title: "Where are we?",
};

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-semibold text-xl">404 - Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          Sorry, this page doesn't exist.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href={indexPath()} prefetch>
            Go back to the home page
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
