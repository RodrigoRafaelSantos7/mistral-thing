"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRightIcon, GithubIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import z from "zod";
import { DynamicImage } from "@/components/app/dynamic-image";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { indexPath, magicLinkPath } from "@/paths";

const schema = z.object({
  email: z.email(),
});

const SignInView = () => {
  const [googlePending, startGoogleTransition] = useTransition();
  const [githubPending, startGithubTransition] = useTransition();
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

  function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: indexPath(),
      });
    });
  }

  function signInWithGitHub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: indexPath(),
      });
    });
  }
  return (
    <form
      className="relative flex h-full w-full flex-1 items-center justify-center p-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="col-span-1 row-span-3 flex max-w-md flex-col items-center justify-center gap-6 rounded-2x">
        <div className="flex min-w-[280px] flex-col items-center gap-2 md:min-w-[350px]">
          <DynamicImage
            alt="Mistral Thing"
            darkSrc="/icon-white.svg"
            height={100}
            lightSrc="/icon.svg"
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
            disabled={googlePending}
            onClick={signInWithGoogle}
            variant="outline"
          >
            {googlePending ? (
              <Spinner />
            ) : (
              <>
                <GoogleIcon className="size-4" />
                <span className="text-sm">Continue with Google</span>
              </>
            )}
          </Button>
          <Button
            disabled={githubPending}
            onClick={signInWithGitHub}
            variant="outline"
          >
            {githubPending ? (
              <Spinner />
            ) : (
              <>
                <GithubIcon className="text-foreground" size={16} />
                <span className="text-sm">Continue with GitHub</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export { SignInView };
