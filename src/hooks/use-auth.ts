import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { loggedOutPath } from "@/paths";

export const useAuth = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(loggedOutPath());
        },
      },
    });
  };

  return { handleSignOut };
};
