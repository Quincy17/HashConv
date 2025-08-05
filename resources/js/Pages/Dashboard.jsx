import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chat from '@/Pages/Chat/ChatSidebar';
import DetailChat from '@/Pages/Chat/DetailChat';
import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import Echo from '../echo';

export default function Dashboard({ messages: initialMessages = [] }) {
    const { auth } = usePage().props; // Ambil data user yang login
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState('');
    const [detailMessage, setDetailMessage] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

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

            fetchSidebarMessage(); // Refresh sidebar biar real-time
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    useEffect(() => {
        if (!auth.user.user_id) return;
    
        const channel = Echo.private(`chat.${auth.user.user_id}`)
            .listen("MessageSent", (event) => {
                // Jika pesan untuk user login
                if (event.message.receiver_id === auth.user.user_id) {
                    if (selectedUserId === event.message.sender_id) {
                        // ✅ User sedang buka chat → langsung tandai read
                        axios.post('/mark-as-read', {
                            sender_id: event.message.sender_id
                        }).then(() => {
                            setDetailMessage(prev => [...prev, event.message]);
                            // Update sidebar agar count = 0
                            fetchSidebarMessage();
                        });
                    } else {
                        // ✅ Pesan dari user lain → update sidebar count
                        fetchSidebarMessage();
                    }
                }
            });
    
        return () => {
            channel.stopListening("MessageSent");
        };
    }, [auth.user.user_id, selectedUserId]);
    

    return (
        <AuthenticatedLayout
            sidebar={<Chat messages={messages} onSelectDetailMessage={fetchDetailMessage} />}
            chatHolder={
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Tulis pesan..."
                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-100"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={!selectedUserId}
                    />
                    <button
                        onClick={handleSend}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                        disabled={!selectedUserId}
                    >
                        Kirim
                    </button>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <DetailChat 
                            detailMessage={detailMessage} 
                            selectedUserId={selectedUserId} 
                            userId={auth.user.user_id}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
