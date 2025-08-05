import React from "react";

export default function ChatSidebar({ messages = [], onSelectDetailMessage }) {
    return (
        <div className="h-full bg-gray-100 dark:bg-gray-800 overflow-y-auto scrollbar-hide">
            <h2 className="px-4 py-3 text-lg font-bold text-gray-700 dark:text-gray-200">
                Chats
            </h2>
            <div>
                {messages.length > 0 ? (
                    messages.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => onSelectDetailMessage(chat.id)}
                            className="flex justify-between items-center px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-300 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={chat.avatar}
                                    alt={chat.name}
                                    className="w-11 h-11 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100">
                                        {chat.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right text-xs text-gray-500 dark:text-gray-400 mb-2">
                                {chat.time}
                                <br/>
                                {chat.count > 0 && (
                                    <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {chat.count}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">No messages found</p>
                )}
            </div>
        </div>
    );
}
