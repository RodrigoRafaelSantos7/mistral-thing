import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { loginPath } from "@/paths";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const token = await getToken();
    const session = await fetchQuery(api.auth.getSession, {}, { token });
    if (!session) {
      return redirect(loginPath());
    }
  } catch (_error) {
    return redirect(loginPath());
  }

  return <div>{children}</div>;
};

export default Layout;
