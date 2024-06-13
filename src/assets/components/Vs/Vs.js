import React, { useContext } from 'react';
import styles from './Vs.module.scss'
import { useNavigate } from 'react-router-dom'
import Friend from './modes/Friend'
import JoinGame from './modes/JoinGame'
import SocketContext from '../../context/SocketContext';

function Vs() {
    const [mode, setMode] = React.useState(0)
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    function createGame() {
        socket.emit('createGame');
    }

    React.useEffect(() => {
        if (!socket) return;
        // // Listen for gameCreated from server
        // socket.on('gameCreated', (code) => {
        //     navigate(`./${code}`);
        // });

        const handleGameCreated = (code) => {
            navigate(`./${code}`);
        };

        const handleError = (message) => {
            alert(message);
        };

        socket.on('gameCreated', handleGameCreated);
        socket.on('error', handleError);

        // Cleanup listeners on unmount or when effect runs again
        return () => {
            socket.off('gameJoined', handleGameCreated);
            socket.off('error', handleError);
        };

    }, [navigate, socket])

    function loadMode() {
        if (mode === 0) {
            return <>
                <h1>Select Mode</h1>
                {/* <button className={styles.vsSelect} disabled onClick={() => navigate('./')}>Computer</button> */}
                <button className={styles.vsSelect} onClick={() => setMode(1)}>Join a Game</button>
                <button className={styles.vsSelect} onClick={() => createGame()}>Create a Game</button>            
            </>
        } else {
            return <>
                <JoinGame setMode={setMode}></JoinGame>
            </>
        } 
    }

    return (
        <div className={styles.vsCont}>
            {loadMode()}
        </div>
    )
}

export default Vs