"use client";

import { Header } from "@/components/layout/header";
import { ThreadContainer } from "@/components/thread/thread-container";
import { ThreadProvider } from "@/context/thread";

const Page = () => (
  <ThreadProvider>
    <ThreadContainer>
      <div className="relative flex flex-1 flex-col">
        <Header />
      </div>
    </ThreadContainer>
  </ThreadProvider>
);

export default Page;
