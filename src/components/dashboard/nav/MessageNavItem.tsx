
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import NavItem from "./NavItem";

const MessageNavItem: React.FC = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState<number | undefined>(undefined);
  
  // Use a safer approach to get unread count
  React.useEffect(() => {
    try {
      // Import and use the context inside the effect to avoid rendering issues
      import("@/contexts/MessageContext").then(({ useMessages }) => {
        const { getUnreadCount } = useMessages();
        const count = getUnreadCount();
        setUnreadCount(count > 0 ? count : undefined);
      }).catch(() => {
        // If context is not available or fails, default to undefined
        setUnreadCount(undefined);
      });
    } catch (error) {
      setUnreadCount(undefined);
    }
  }, [location.pathname]);

  return (
    <NavItem
      to="/messages"
      icon={<MessageSquare size={20} />}
      label="Messages"
      active={location.pathname === "/messages"}
      badge={unreadCount}
    />
  );
};

export default MessageNavItem;
