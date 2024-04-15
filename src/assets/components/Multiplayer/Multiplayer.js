import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import SocketContext from '../../context/SocketContext';
import styles from './Multiplayer.module.scss'

// const ENDPOINT = "http://localhost:8080";
// const socket = socketIOClient(ENDPOINT);
const initialDice = [
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0}
];

const initialPlayer = {
    player: "", 
    dice: initialDice.map((d) => ({...d})), 
    turnNum: 0, 
    diceLeft: 6
}

function Multiplayer() {
    const { gameCode } = useParams();
    const [dice, setDice] = useState([]);
    const [turn, setTurn] = useState('');
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [playerId, setPlayerId] = useState(null);
    const [p1, setP1] = useState(initialPlayer);
    const [p2, setP2] = useState(initialPlayer);
    const [opp, setOpp] = useState("")
    const [score, setScore] = useState(0);
    const socket = useContext(SocketContext);
    const [minPick, setMinPick] = useState(0);
    const [diceNum, setDiceNum] = useState(6);
    const [didRoll, setDidRoll] = useState(false);

    useEffect(() => {
        if (socket) {
            //console.log(socket._opts.query.userId)
            socket.emit('joinRoom', gameCode);
            setPlayerId(socket._opts.query.userId);
            
            socket.on('gameState', (state) => {
                //console.log(state)
                setP1(state.p1)
                setP2(state.p2)
                setOpp(state.players.find(id => id !== playerId))
                // setDice(state.dice);
                setTurn(state.turnNum);
                setIsMyTurn(state.turn === playerId);
            });
    
            // socket.on('connect', () => {
            //     setPlayerId(socket._opts.query.userId);
            // });
    
            // return () => {
            //     socket.off('connect');
            //     socket.off('gameState');
            // };
        }
        
    }, [gameCode, playerId, socket]);

    const rollDice = () => {
        if (!didRoll) {
            socket.emit('rollDice', gameCode);
            setDidRoll(true);
        }
    };

    function showDice(player) {
        // console.log(player)
        // console.log(p1[0].player)
        //console.log(p1)
        if (player === p1.player) {
            return p1.dice.map((d, i) => <div className={d.locked === false ? styles.dice : styles.diceLocked} onClick={() => handleLock(i)}>
                    <p>{d.value === 0 ? '?' : d.value}</p></div>)
        } else {
            return p2.dice.map((d, i) => <div className={d.locked === false ? styles.dice : styles.diceLocked} onClick={() => handleLock(i)}>
                    <p>{d.value === 0 ? '?' : d.value}</p></div>)
        }
    }

    function handleLock(idx) {
        let you;

        if (!didRoll) {
            return;
        }

        if (p1.player === playerId) {
            you = p1;
        } else {
            you = p2;
        }
        
        if (turn === 0) {
            return;
        }
        
        if (you.dice[idx].locked === false) {
            if (you.dice[idx].value === 3) {
                setScore(score + 0);
            } else {
                setScore(score + you.dice[idx].value);
            }
            setDiceNum(diceNum-1);
            setMinPick(minPick+1);
            const newDice = you.dice.map((d,i) => {
                if (i !== idx) {
                    return d;
                } else {
                    d.locked = true;
                    d.turnLock = turn;
                    return d;
                }
            })
            console.log(newDice)
            setDice(newDice);
        } else {
            if (you.dice[idx].turnLock !== turn && you.dice[idx].turnLock !== 0) {
                return;
            }
            if (you.dice[idx].value === 3) {
                setScore(score - 0);
            } else {
                setScore(score - you.dice[idx].value);
            }
            setDiceNum(diceNum+1);
            setMinPick(minPick-1);
            const newDice = dice.map((d,i) => {
                if (i !== idx) {
                    return d;
                } else {
                    d.locked = false;
                    d.turnLock = 0;
                    return d;
                }
            })
            setDice(newDice);
        }
    }

    const submitDice = () => {
        setDidRoll(false);
        socket.emit('submitDice', gameCode, dice, playerId, score);
    }

    return (
        <div>
            <h1>Game: {gameCode}</h1>
            <h2>It's {isMyTurn ? "your" : "their"} turn</h2>
            <br></br>
            
            <h1>Opp: {opp}</h1>
            <h2>Score: {p1.player === opp ? p1.score : p2.score}</h2>
            <div className={styles.playerBoard}>
                {showDice(opp)}
            </div>
            <br></br>
            
            <h1>You: {playerId}</h1>
            <h2>Score: {score}</h2>
            <div className={styles.playerBoard}>
                {showDice(playerId)}
            </div>
            <br></br>

            <div>
                <button onClick={rollDice} disabled={!isMyTurn || didRoll}>Roll Dice</button>
                <button onClick={submitDice} disabled={!isMyTurn}>Submit</button>
            </div>
        </div>
    );
}

export default Multiplayer