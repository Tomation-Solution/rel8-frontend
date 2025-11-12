import React from 'react';
import { ChatUserDataType } from "../../types/myTypes";
import dummyImage from '../../assets/images/dummy.jpg';
import { HiUser } from 'react-icons/hi';

interface Props {
    image?: string;
    name?: string;
    lastMessage?: string;
    selected?: boolean;
    online?: boolean;
    chatUser: ChatUserDataType;
    onClick?: () => void;
}

const ChatUser: React.FC<Props> = ({
    image,
    name,
    lastMessage,
    selected = false,
    online = false,
    chatUser,
    onClick
}) => {
    const displayName = name || 'Unknown User';

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
                {/* User Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                    selected ? "bg-white/20" : "bg-org-primary/10"
                }`}>
                    {image && image !== dummyImage ? (
                        <img
                            src={image}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <HiUser className={`w-5 h-5 ${selected ? "text-white" : "text-org-primary"}`} />
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm truncate ${
                        selected ? "text-white" : "text-textColor"
                    }`}>
                        {displayName}
                    </h4>
                    {lastMessage && (
                        <p className={`text-xs truncate ${
                            selected ? "text-white/80" : "text-gray-500"
                        }`}>
                            {lastMessage}
                        </p>
                    )}
                </div>

                {/* Online Status Indicator */}
                <div className="flex flex-col items-end gap-1">
                    {online !== undefined && (
                        <div className={`w-2 h-2 rounded-full ${
                            online ? "bg-green-500" : "bg-gray-400"
                        }`} />
                    )}

                    {/* Selection Indicator */}
                    {selected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatUser
