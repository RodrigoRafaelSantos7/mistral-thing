import type { ReactNode } from "react";
import { BackButton } from "@/components/app/back-button";

const AccountLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative flex flex-1">
    <div className="relative z-1 flex min-h-screen flex-1 overflow-auto">
      <BackButton />
      <div className="w-full p-4">{children}</div>
    </div>
  </div>
);

export default AccountLayout;
