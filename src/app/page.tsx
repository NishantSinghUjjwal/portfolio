import { ChatLayout } from "@/components/chat-layout";
import { ChatProvider } from "@/components/chat-provider";

export default function Home() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}
