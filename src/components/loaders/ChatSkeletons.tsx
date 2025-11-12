import React from 'react';

export const ChatListSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-3 rounded-md bg-neutral-3 animate-pulse">
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-neutral-4 flex-shrink-0"></div>

            {/* Content skeleton */}
            <div className="flex-1 min-w-0">
              {/* Name skeleton */}
              <div className="h-4 bg-neutral-4 rounded w-3/4 mb-2"></div>
              {/* Subtitle skeleton */}
              <div className="h-3 bg-neutral-4 rounded w-1/2"></div>
            </div>

            {/* Status indicator skeleton */}
            <div className="w-2 h-2 rounded-full bg-neutral-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChatMessagesSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 px-4 py-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`flex  ${index % 2 === 0 ? 'justify-start' : 'justify-end'} animate-pulse`}
        >
          <div className={`min-w-[50%] ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
            {/* Message bubble skeleton */}
            <div className={`p-3 rounded-lg ${
              index % 2 === 0 ? 'bg-neutral-3' : 'bg-org-primary'
            }`}>
              {/* Message lines */}
              <div className="space-y-2">
                <div className={`h-3 rounded ${
                  index % 2 === 0 ? 'bg-neutral-4' : 'bg-white/30'
                } ${index % 3 === 0 ? 'w-full' : 'w-3/4'}`}></div>
                <div className={`h-3 rounded ${
                  index % 2 === 0 ? 'bg-neutral-4' : 'bg-white/30'
                } ${index % 2 === 0 ? 'w-1/2' : 'w-2/3'}`}></div>
                {index % 4 === 0 && (
                  <div className={`h-3 rounded ${
                    index % 2 === 0 ? 'bg-neutral-4' : 'bg-white/30'
                  } w-1/3`}></div>
                )}
              </div>
            </div>
            {/* Timestamp skeleton */}
            <div className={`text-xs mt-1 ${
              index % 2 === 0 ? 'text-left' : 'text-right'
            }`}>
              <div className="h-3 bg-neutral-4 rounded w-12 inline-block"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChatHeaderSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-org-primary to-org-primary/90 text-white border-b border-gray-200 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <div className="w-6 h-6 bg-white/30 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-white/30 rounded w-20 mb-1"></div>
          <div className="h-3 bg-white/20 rounded w-16"></div>
        </div>
      </div>

      <div className="p-2 rounded-full bg-white/20">
        <div className="w-5 h-5 bg-white/30 rounded"></div>
      </div>
    </div>
  );
};