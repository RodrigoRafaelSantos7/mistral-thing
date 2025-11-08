import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { indexPath, loginPath } from "@/paths";

const Page = () => (
  <div className="relative flex h-full w-full flex-1 items-center justify-center p-4">
    <title>Magic Link Sent</title>
    <div className="col-span-1 row-span-3 flex max-w-md flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
          <MailIcon className="size-6 text-blue-600 dark:text-blue-400" />
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
          <Button asChild className="w-full">
            <Link href={indexPath()}>
              <ArrowLeftIcon className="size-4" />
              <span className="text-primary-foreground">Back to Home</span>
            </Link>
          </Button>
        </div>

        <div className="w-full">
          <Button asChild className="w-full" variant="outline">
            <Link href={loginPath()}>
              <span className="text-sm">Try Another Email</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default Page;
