import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Message, MessageActions } from "@/components/ui/message";

export function PendingMessage() {
  return (
    <Message className="mx-auto w-full flex-col py-4">
      <Loader variant="typing" />
      <MessageActions className="opacity-0">
        <Button size="icon" variant="ghost">
          <CopyIcon className="size-3" />
        </Button>
      </MessageActions>
    </Message>
  );
}
