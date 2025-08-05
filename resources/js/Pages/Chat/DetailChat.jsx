import React, { useEffect, useState, useRef } from "react";
import Echo from "../../echo";

export default function DetailChat({ detailMessage = [], selectedUserId, userId }) {
    const [messages, setMessages] = useState(detailMessage);
    const chatContainerRef = useRef(null);

    // Update state saat props detailMessage berubah (misal setelah fetch)
    useEffect(() => {
        setMessages(detailMessage);
    }, [detailMessage]);

    // Listener Laravel Reverb
    useEffect(() => {
        if (!userId || !selectedUserId) return;
    
        console.log("📡 Subscribing to:", `chat.${userId}`, `chat.${selectedUserId}`);
    
        const channelUser = Echo.private(`chat.${userId}`)
            .listen("MessageSent", (event) => {
                console.log("📥 Pesan diterima:", event.message);
                setMessages(prev => [...prev, event.message]);
            });
    
        const channelReceiver = Echo.private(`chat.${selectedUserId}`)
            .listen("MessageSent", (event) => {
                console.log("📤 Pesan terkirim:", event.message);
                setMessages(prev => [...prev, event.message]);
            });
    
        return () => {
            channelUser.stopListening("MessageSent");
            channelReceiver.stopListening("MessageSent");
        };
    }, [userId, selectedUserId]);

    // Auto-scroll ke bawah setiap kali pesan bertambah
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={chatContainerRef}
            className="p-6 text-gray-900 dark:text-gray-100 space-y-3 h-[1000px] overflow-y-auto scrollbar-hide"
        >
            {messages.length > 0 ? (
                messages.map((msg) => (
                    <div
                        key={msg.message_id}
                        className={`flex ${
                            msg.sender_id === selectedUserId
                                ? "justify-start"
                                : "justify-end"
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs ${
                                msg.sender_id === selectedUserId
                                    ? "bg-gray-300 text-black"
                                    : "bg-blue-500 text-white"
                            }`}
                        >
                            <p>{msg.message}</p>
                            <span className="text-xs block mt-1 opacity-70">
                                {new Date(msg.sent_at).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Pilih chat di sidebar untuk melihat pesan.</p>
            )}
        </div>
    );
}
