import React, { useState, useEffect, useContext } from 'react';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../../../context/SocketContext';
import styles from '../Vs.module.scss'

// const ENDPOINT = "http://localhost:8080"; // Your server URL here
// const socket = socketIOClient(ENDPOINT);

function Friend({ setMode }) {
    const [gameCode, setGameCode] = useState('');
    const [gameStatus, setGameStatus] = useState('');
    const [code, setCode] = useState("");
    const [ready, setReady] = useState(false);
    const [option, setOption] = useState(0);
    const navigate = useNavigate();
    
    const socket = useContext(SocketContext);
  
    const createGame = () => {
        setOption(1);
        socket.emit('createGame');
    };
  
    const joinGame = () => {
        setCode(gameCode);
        socket.emit('joinGame', gameCode);
    };

    useEffect(() => {
        
        // Listen for gameCreated from server
        socket.on('gameCreated', (code) => {
            setGameStatus(`Game created! Your game code is: ${code}`);
            setCode(code);
        });

        // Listen for gameJoined from server
        socket.on('gameJoined', (state) => {
            setGameStatus('Joined game! Waiting for other player...');
        });

        // Listen for gameStart from server
        socket.on('gameStart', (games) => {
            //console.log(games)
            setGameStatus(`Players ready`);
            setReady(true);
        });

        socket.on('error', (message) => {
            alert(message);
        });

    }, [navigate, socket])

    useEffect(() => {
        if (ready) {
            navigate(`./${code}`);
        }
    }, [code, navigate, ready])

    function settings() {
        if (option === 0) {
            return <><button onClick={createGame}>Create New Game</button>
                <button onClick={() => setOption(2)}>Join a Game</button></>
        } else if (option === 1) {
            return <button onClick={() => setOption(0)}>Back</button>
        } else {
            return <><div>
                    <input type="text" value={gameCode} onChange={(e) => setGameCode(e.target.value)} placeholder="Enter Game Code" />
                    <button onClick={joinGame}>Enter</button>
                </div>
                <button onClick={() => setOption(0)}>Back</button></>
        }
    }

    return (

        <div className={styles.friendCont}>
            <div className={styles.friendText}>
                <h2>Guest</h2>
            </div>
            
            {settings()}
            
            <div>{gameStatus}</div>
            <div className={styles.friendText}>
                <button onClick={() => setMode(0)}>CANCEL</button>
            </div>
        </div>
        
    )
}

export default Friend