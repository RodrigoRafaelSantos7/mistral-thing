import { MailIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { loginPath } from "@/paths";

export const metadata: Metadata = {
  title: "Magic Link Sent",
};

const Page = () => (
  <div className="relative flex h-full w-full flex-1 items-center justify-center p-4">
    <div className="col-span-1 row-span-3 flex max-w-md flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <MailIcon className="size-6 text-primary" />
        </div>
        <span className="font-semibold text-foreground text-xl">
          Magic Link Sent
        </span>
        <span className="text-center text-muted-foreground text-sm">
          We've sent a magic link to your email address. Check your inbox and
          click the link to sign in to your account.
        </span>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="w-full">
          <Button asChild className="w-full" variant="outline">
            <Link href={loginPath()} prefetch>
              <span className="text-sm">Try Another Email</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default Page;
