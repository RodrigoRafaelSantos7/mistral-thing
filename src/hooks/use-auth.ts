import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";
import { loggedOutPath } from "@/paths";

const log = logger.child({ module: "useAuth" });

export const useAuth = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      log.error({ error }, "Failed to sign out");
    }
    router.replace(loggedOutPath());
  };

  return { handleSignOut };
};
