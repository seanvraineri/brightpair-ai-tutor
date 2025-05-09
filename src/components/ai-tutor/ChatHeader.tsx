
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash, Download, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onClear: () => void;
  onSave?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, subtitle, onClear, onSave }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display flex items-center text-brightpair-700">
          <Sparkles className="mr-2 h-6 w-6 text-brightpair" />
          {title}
        </h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onClear} className="text-xs">
          <Trash size={14} className="mr-1" />
          Clear
        </Button>
        {onSave && (
          <Button variant="outline" size="sm" className="text-xs" onClick={onSave}>
            <Download size={14} className="mr-1" />
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
