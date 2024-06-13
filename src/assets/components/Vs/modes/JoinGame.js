import styles from '../Vs.module.scss'
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../../../context/SocketContext';

function JoinGame({ setMode }) {
    const [gameCode, setGameCode] = React.useState('');
    const [code, setCode] = React.useState("");
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const joinGame = () => {
        setCode(gameCode);
        socket.emit('joinGame', gameCode);
    };

    React.useEffect(() => {
        if (!socket) return;

        const handleGameJoined = (state) => {
            navigate(`./${code}`);
        };

        const handleError = (message) => {
            alert(message);
        };

        // Add listeners
        socket.on('gameJoined', handleGameJoined);
        socket.on('error', handleError);

        // Cleanup listeners on unmount or when effect runs again
        return () => {
            socket.off('gameJoined', handleGameJoined);
            socket.off('error', handleError);
        };
    }, [navigate, socket, code]);
    
    return (
        <div className={styles.friendCont}>
            <div>
                <h1>Join An Existing Game</h1>
            </div>
            <div className={styles.friendText}>
                <input type="text" value={gameCode} onChange={(e) => setGameCode(e.target.value)} placeholder="Enter Game Code" />
                <button onClick={joinGame}>Enter</button>
            </div>
            <button className={styles.backBtn} onClick={() => setMode(0)}>Back</button>
        </div>
    )
}

export default JoinGame