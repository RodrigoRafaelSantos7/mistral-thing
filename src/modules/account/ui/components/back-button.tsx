"use client";

import { ArrowLeftIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { indexPath } from "@/paths";

const BackButton = () => (
  <motion.div
    animate={{ opacity: 1, x: 0 }}
    className="absolute top-0 left-0 z-10 p-4"
    initial={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <div>
      <Link href={indexPath()} prefetch>
        <Button variant="ghost">
          <ArrowLeftIcon className="size-4" />
          <span>Back</span>
        </Button>
      </Link>
    </div>
  </motion.div>
);

export { BackButton };
