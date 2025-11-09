import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "useAuth" });

export const useAuth = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      log.error({ error }, "Failed to sign out");
    }

    // Instead of redirecting, we refresh the page to clear the auth state.
    // This works around the issue where the user might not manually refresh,
    // and because the getSession query in the providers is non-reactive,
    // a full page reload is required to ensure the auth state is cleared.
    router.refresh();
  };

  return { handleSignOut };
};
