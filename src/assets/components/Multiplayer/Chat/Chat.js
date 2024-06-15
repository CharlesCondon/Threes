import React, { useState, useEffect, useContext } from 'react';
import SocketContext from '../../../context/SocketContext';
import styles from './Chat.module.scss'; // Import necessary CSS

const Chat = ({ gameCode, players, chat, open }) => {
    const socket = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    //const [players, setPlayers] = useState([{id:'P1', score:0, pos:0}]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (chat) {
            setMessages(chat)
        }
    }, [chat])

    useEffect(() => {
        if (socket) {
            socket.on('gameState', (game) => {
                setMessages(game.chat);
                //setPlayers(game.players);
            });

            return () => {
                socket.off('gameState');
            };
        }
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            socket.emit('chatMessage', gameCode, newMessage);
            setNewMessage('');
        }
    };

    function getPnum(id) {
        console.log(players)
        console.log(id)
        const player = players.find((p) => p.id === id);
        console.log(player)
        //return player.pos+1;
    }

    return (
        <div className={`${styles.chatContainer} ${!open ? styles.chatClosed : ''}`}>
            <div className={styles.chatMessages}>
                {messages ? messages.map((msg, index) => (
                    <div key={index} className={styles.chatMessage}>
                        <span className={styles.chatUser}>P{msg.userPos+1}:</span> {msg.message}
                    </div>
                )): <></>}
            </div>
            <form onSubmit={sendMessage} className={styles.chatForm}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.chatInput}
                />
                <button type="submit" className={styles.chatSendBtn}>Send</button>
            </form>
        </div>
    );
};

export default Chat;