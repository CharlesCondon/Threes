import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import SocketContext from './SocketContext';

//const ENDPOINT = "https://threes-server.adaptable.app/";
const ENDPOINT = "http://localhost:8080";

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    function generateUserId() {
        let userId = localStorage.getItem("userId");
        if (!userId) {
            userId = Math.random().toString(36).substring(2, 15); // Example ID generation
            localStorage.setItem("userId", userId);
        }
        return userId;
    }
    // eslint-disable-next-line no-unused-vars
    const userId = generateUserId();

    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT, {
            query: {userId: generateUserId()}
        });
        setSocket(newSocket);

        return () => newSocket.disconnect(); // Cleanup on unmount
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
