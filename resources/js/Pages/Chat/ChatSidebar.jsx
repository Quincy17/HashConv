import React, { useState } from "react";
import axios from "axios";

export default function ChatSidebar({ messages = [], onSelectDetailMessage }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 1) {
            setIsSearching(true);
            try {
                const response = await axios.get(`/search-user?query=${value}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error("Search failed:", error);
            }
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    };

    const handleSelectUser = (userId) => {
        onSelectDetailMessage(userId);
        setSearchQuery("");
        setIsSearching(false);
    };

    return (
        <div className="h-full bg-gray-100 dark:bg-gray-800 overflow-y-auto scrollbar-hide">
            <h2 className="px-4 py-3 text-lg font-bold text-gray-700 dark:text-gray-200">
                Chats
            </h2>

            {/* 🔍 Search Bar */}
            <div className="px-4 mb-2">
                <input
                    type="text"
                    placeholder="Search user..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div>
                {/* Jika sedang searching, tampilkan hasil pencarian */}
                {isSearching && searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <div
                            key={user.user_id}
                            onClick={() => handleSelectUser(user.user_id)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-300 dark:border-gray-700"
                        >
                            <img
                                src={user.avatar ?? `https://i.pravatar.cc/40?u=${user.user_id}`}
                                alt={user.name}
                                className="w-11 h-11 rounded-full object-cover"
                            />
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                                {user.name}
                            </p>
                        </div>
                    ))
                ) : !isSearching && messages.length > 0 ? (
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
                                <br />
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
