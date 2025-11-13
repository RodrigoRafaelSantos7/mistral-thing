import { LayoutApp } from "@/components/layout/layout-app";
import { MessageList } from "@/components/thread/message/message-list";
import { MessagesProvider } from "@/lib/threads-store/messages/provider";

const Page = () => (
  <MessagesProvider>
    <LayoutApp>
      <MessageList />
    </LayoutApp>
  </MessagesProvider>
);

export default Page;
