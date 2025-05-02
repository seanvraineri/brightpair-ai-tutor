
import React from "react";
import MessageBox from "@/components/messaging/MessageBox";
import { MessageProvider } from "@/contexts/MessageContext";

const Messages: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <MessageProvider>
          <MessageBox />
        </MessageProvider>
      </div>
    </div>
  );
};

export default Messages;
