"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRightIcon, GithubIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import z from "zod";
import { Anonymous, NotAnonymous } from "@/components/app/auth";
import { Redirect } from "@/components/app/redirect";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-database";
import { authClient } from "@/lib/auth-client";
import { indexPath, magicLinkPath } from "@/paths";

const schema = z.object({
  email: z.email(),
});

const Page = () => {
  const { settings } = useSettings();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.magicLink({
        email: value.email,
        callbackURL: indexPath(),
        fetchOptions: {
          onSuccess: () => {
            router.push(magicLinkPath());
          },
        },
      });
    },
    validators: {
      onMount: schema,
      onChange: schema,
      onSubmit: schema,
    },
  });

  return (
    <form
      className="relative flex h-full w-full flex-1 items-center justify-center p-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Anonymous>
        <title>Login into Mistral Thing</title>
        <div className="col-span-1 row-span-3 flex max-w-md flex-col items-center justify-center gap-6 rounded-2x">
          <div className="flex min-w-[280px] flex-col items-center gap-2 md:min-w-[350px]">
            <Image
              alt="Mistral Thing"
              height={100}
              src={settings?.mode === "light" ? "/icon.svg" : "/icon-white.svg"}
              width={100}
            />
            <span className="font-semibold text-foreground text-xl">
              Login to Mistral Thing
            </span>
            <span className="text-muted-foreground text-sm">
              Enter your email to login to your account
            </span>
          </div>
          <div className="w-full">
            <form.Field name="email">
              {(field) => (
                <div className="flex w-full flex-col gap-2">
                  <span className="text-sm">Email</span>
                  <Input
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="m@example.com"
                    value={field.state.value}
                  />
                </div>
              )}
            </form.Field>
          </div>
          <div className="w-full">
            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
                canSubmit: state.canSubmit,
              })}
            >
              {({ isSubmitting, canSubmit }) => (
                <Button
                  className="w-full"
                  disabled={!canSubmit || isSubmitting}
                  type="submit"
                >
                  <span className="text-primary-foreground">Continue</span>
                  {isSubmitting ? (
                    <Loader2
                      className="animate-spin text-primary-foreground"
                      size={10}
                    />
                  ) : (
                    <ArrowRightIcon
                      className="text-primary-foreground"
                      size={10}
                    />
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
          <div className="flex w-full flex-row items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">Or</span>
            <Separator className="flex-1" />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: indexPath(),
                });
              }}
              variant="outline"
            >
              <GoogleIcon className="size-4" />
              <span className="text-sm">Continue with Google</span>
            </Button>
            <Button
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "github",
                  callbackURL: indexPath(),
                });
              }}
              variant="outline"
            >
              <GithubIcon className="text-foreground" size={16} />
              <span className="text-sm">Continue with GitHub</span>
            </Button>
          </div>
        </div>
      </Anonymous>
      <NotAnonymous>
        <Redirect to={indexPath()} />
      </NotAnonymous>
    </form>
  );
};

export default Page;
