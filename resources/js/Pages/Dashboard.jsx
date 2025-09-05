import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chat from '@/Pages/Chat/ChatSidebar';
import DetailChat from '@/Pages/Chat/DetailChat';
import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import Echo from '../echo';
import EmojiPicker from 'emoji-picker-react';

export default function Dashboard({ messages: initialMessages = [] }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState('');
    const [detailMessage, setDetailMessage] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const fetchSidebarMessage = async () => {
        try {
            const response = await axios.get('/messages');
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    const fetchDetailMessage = async (senderId) => {
        try {
            const response = await axios.get(`/detail-message/${senderId}`);
            setDetailMessage(response.data);
            setSelectedUserId(senderId);
        } catch (error) {
            console.error("Failed to load detail messages:", error);
        }
    };

    const handleSend = async () => {
        if (!message.trim() || !selectedUserId) return;
        try {
            await axios.post("/send-message", {
                message,
                receiver_id: selectedUserId
            });
            setMessage('');
            fetchSidebarMessage();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    useEffect(() => {
        if (!auth.user.user_id) return;

        const channel = Echo.private(`chat.${auth.user.user_id}`)
            .listen("MessageSent", (event) => {
                if (event.message.receiver_id === auth.user.user_id) {
                    if (selectedUserId === event.message.sender_id) {
                        axios.post('/mark-as-read', {
                            sender_id: event.message.sender_id
                        }).then(() => {
                            setDetailMessage(prev => [...prev, event.message]);
                            fetchSidebarMessage();
                        });
                    } else {
                        fetchSidebarMessage();
                    }
                }
            });

        return () => {
            channel.stopListening("MessageSent");
        };
    }, [auth.user.user_id, selectedUserId]);

    return (
        <AuthenticatedLayout>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-1/3 lg:w-1/4 border-r dark:border-gray-700 overflow-y-auto">
                    <Chat messages={messages} onSelectDetailMessage={fetchDetailMessage} />
                </div>

                {/* Chat detail */}
                <div className="flex flex-col w-2/3 lg:w-3/4">
                    <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 scrollbar-hide pt-16">
                        <DetailChat
                            detailMessage={detailMessage}
                            selectedUserId={selectedUserId}
                            userId={auth.user.user_id}
                        />
                    </div>

                    {/* Input area */}
                    <div className="p-3 border-t dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-900">
                        {/* Emoji button */}
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="rounded-md px-2 text-xl"
                        >
                            <span className="text-gray-500 dark:text-gray-300">☺</span>
                        </button>

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Tulis pesan..."
                            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm 
                                    focus:border-blue-500 focus:ring focus:ring-blue-200 
                                    dark:bg-gray-700 dark:text-gray-100"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={!selectedUserId}
                        />

                        {showEmojiPicker && (
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
                                <EmojiPicker
                                    onEmojiClick={(emojiData) => {
                                        setMessage((prev) => prev + emojiData.emoji);
                                        setShowEmojiPicker(false);
                                    }}
                                />
                            </div>
                        )}

                        {/* Send button */}
                        <button
                            onClick={handleSend}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white 
                                    hover:bg-blue-700 focus:outline-none focus:ring-2 
                                    focus:ring-blue-400 disabled:opacity-50"
                            disabled={!selectedUserId}
                        >
                            Kirim
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
