"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useUserSettings } from "@/lib/user-settings-store/provider";
import { loginPath } from "@/paths";

const Page = () => {
  const { settings } = useUserSettings();
  const router = useRouter();
  return (
    <div>
      <h1>Page</h1>
      <p>Mode: {settings.mode}</p>
      <p>Theme: {settings.theme}</p>
      <p>Nickname: {settings.nickname}</p>
      <p>Biography: {settings.biography}</p>
      <p>Instructions: {settings.instructions}</p>
      <p>Model ID: {settings.modelId}</p>
      <p>Pinned Models: {settings.pinnedModels.join(", ")}</p>

      <Button
        onClick={() =>
          authClient.signOut().then(() => router.push(loginPath()))
        }
      >
        Logout
      </Button>
    </div>
  );
};

export default Page;
