import React from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import { BsPeople } from 'react-icons/bs';

interface GroupChat {
  _id: string;
  name: string;
  description?: string;
  memberIds: string[];
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

interface GroupChatItemProps {
  group: GroupChat;
  selected: boolean;
  onClick: () => void;
}

const GroupChatItem: React.FC<GroupChatItemProps> = ({ group, selected, onClick }) => {
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
        {/* Group Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          selected ? "bg-white/20" : "bg-org-primary/10"
        }`}>
          <BsPeople className={`w-5 h-5 ${selected ? "text-white" : "text-org-primary"}`} />
        </div>

        {/* Group Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm truncate ${
            selected ? "text-white" : "text-textColor"
          }`}>
            {group.name}
          </h4>
          <p className={`text-xs truncate ${
            selected ? "text-white/80" : "text-gray-500"
          }`}>
            {group.description || `${group.memberIds.length} members`}
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

export default GroupChatItem;