import React, { useState } from "react";
import axios from "axios";
import Dropdown from "@/Components/Dropdown"; // ✅ Gunakan komponen dropdown yang sudah ada

export default function ChatSidebar({ messages = [], onSelectDetailMessage }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

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
        setSelectedUserId(userId);
        setSearchQuery("");
        setIsSearching(false);
    };

    return (
        <div className="h-full bg-gray-100 dark:bg-gray-800 overflow-y-auto scrollbar-hide relative pt-16">
            <div className="flex justify-between items-center px-4 py-3">
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                    Chats
                </h2>

                <div className="relative">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content className="absolute ml-2 top-0 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                            {/* <Dropdown.Link href={route(chat.privateChat)}>Private Message</Dropdown.Link>
                            <Dropdown.Link href={route(chat.archiveChat)}>Archived</Dropdown.Link> */}
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

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

            {/* 🔹 List Chat */}
            <div>
                {isSearching && searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <div
                            key={user.user_id}
                            onClick={() => handleSelectUser(user.user_id)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer  
                                hover:bg-gray-200 dark:hover:bg-gray-700 
                                ${selectedUserId === user.user_id ? "bg-blue-200 dark:bg-gray-700 rounded" : ""}`}
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
                            onClick={() => handleSelectUser(chat.id)}
                            className={`flex justify-between items-center px-4 py-3 cursor-pointer mt-1
                                hover:bg-gray-200 dark:hover:bg-gray-700 rounded
                                ${selectedUserId === chat.id ? "bg-blue-200 dark:bg-gray-700 dark:border-gray-300 rounded border-b" : ""}`}
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
                    <p className="text-center text-gray-500 py-4">No user found</p>
                )}
            </div>
        </div>
    );
}
