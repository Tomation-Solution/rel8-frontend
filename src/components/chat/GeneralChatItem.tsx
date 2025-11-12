import React from 'react';
import { BsChatDots } from 'react-icons/bs';

interface GeneralChatItemProps {
  selected: boolean;
  onClick: () => void;
}

const GeneralChatItem: React.FC<GeneralChatItemProps> = ({ selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative hover:cursor-pointer p-3 rounded-md transition-all duration-200 ${
        selected
          ? "bg-org-primary text-white shadow-md"
          : "bg-neutral-3 hover:bg-neutral-4 text-textColor"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* General Chat Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          selected ? "bg-white/20" : "bg-org-primary/10"
        }`}>
          <BsChatDots className={`w-5 h-5 ${selected ? "text-white" : "text-org-primary"}`} />
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm ${
            selected ? "text-white" : "text-textColor"
          }`}>
            General Chat
          </h4>
          <p className={`text-xs ${
            selected ? "text-white/80" : "text-gray-500"
          }`}>
            Public discussion
          </p>
        </div>

        {/* Selection Indicator */}
        {selected && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default GeneralChatItem;