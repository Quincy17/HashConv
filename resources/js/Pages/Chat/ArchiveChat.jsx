import React, { useState } from 'react';

const ArchiveChat = () => {
    const [archivedChats, setArchivedChats] = useState([
        { id: 1, name: 'John Doe', lastMessage: 'See you tomorrow!' },
        { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for the update.' },
    ]);

    const handleRestore = (id) => {
        setArchivedChats(archivedChats.filter(chat => chat.id !== id));
        alert(`Chat with ID ${id} restored!`);
    };

    return (
        <div>
            <h1>Archived Chats</h1>
            {archivedChats.length > 0 ? (
                <ul>
                    {archivedChats.map(chat => (
                        <li key={chat.id} style={{ marginBottom: '10px' }}>
                            <strong>{chat.name}</strong>
                            <p>{chat.lastMessage}</p>
                            <button onClick={() => handleRestore(chat.id)}>Restore</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No archived chats available.</p>
            )}
        </div>
    );
};

export default ArchiveChat;