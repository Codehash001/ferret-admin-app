"use client";
import Chat from "@/components/chat/chat";
import { useChat } from "ai/react";
import { useState } from "react";

const Page: React.FC = () => {
  const [context, setContext] = useState<string[] | null>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="...">
      <div className="...">
        <Chat
          input={input}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleSubmit}
          messages={messages}
        />
      </div>
    </div>
  );
};

export default Page;