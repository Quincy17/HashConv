import React, { useState, useEffect } from 'react';

const PrivateChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Simulate fetching initial messages
    useEffect(() => {
        const initialMessages = [
            { id: 1, sender: 'User1', text: 'Hello!' },
            { id: 2, sender: 'User2', text: 'Hi there!' },
        ];
        setMessages(initialMessages);
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message = {
            id: messages.length + 1,
            sender: 'You',
            text: newMessage,
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

    return (
        <div style={styles.container}>
            <div style={styles.chatBox}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        style={{
                            ...styles.message,
                            alignSelf: message.sender === 'You' ? 'flex-end' : 'flex-start',
                            backgroundColor: message.sender === 'You' ? '#DCF8C6' : '#FFF',
                        }}
                    >
                        <strong>{message.sender}: </strong>
                        {message.text}
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={styles.input}
                />
                <button onClick={handleSendMessage} style={styles.button}>
                    Send
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    chatBox: {
        flex: 1,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        backgroundColor: '#f0f0f0',
    },
    message: {
        margin: '5px 0',
        padding: '10px',
        borderRadius: '8px',
        maxWidth: '70%',
    },
    inputContainer: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginRight: '10px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default PrivateChat;