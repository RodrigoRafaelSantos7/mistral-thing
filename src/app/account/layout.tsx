import { ArrowLeftIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { indexPath } from "@/paths";

const AccountLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative flex flex-1">
    <div className="relative z-1 flex flex-1 overflow-auto">
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-0 left-0 z-10 p-4"
        initial={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <Link href={indexPath()}>
            <Button variant="ghost">
              <ArrowLeftIcon className="size-4" />
              <span>Back</span>
            </Button>
          </Link>
        </div>
      </motion.div>
      <div className="w-full p-4">{children}</div>
    </div>
  </div>
);

export default AccountLayout;
