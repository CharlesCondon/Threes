import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
//import socketIOClient from 'socket.io-client';
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
    //const [dice, setDice] = useState([]);
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
    const [gameDone, setGameDone] = useState(false);

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
                setGameDone(state.done)
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

    useEffect(() => {
        let s;
        let num;
        if (playerId === p1.player) {
            s = p1.dice.reduce((total, d) => {
                if (d.locked) {
                    if (d.value === 3) {
                        return total + 0
                    } else {
                        return total + d.value
                    }
                } else {
                    return total + 0
                }
            }, 0);

            num = p1.dice.reduce((total, d) => {
                if (d.locked) {
                    return total - 1
                } else {
                    return total - 0
                }
            }, 6);
        } else {
            s = p2.dice.reduce((total, d) => {
                if (d.locked) {
                    if (d.value === 3) {
                        return total + 0
                    } else {
                        return total + d.value
                    }
                } else {
                    return total + 0
                }
            }, 0);
            num = p2.dice.reduce((total, d) => {
                if (d.locked) {
                    return total - 1
                } else {
                    return total - 0
                }
            }, 6);
        }
        
        const gameState = {
            p1, p2, s, num, minPick, didRoll
        };
        console.log(gameState);
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }, [p1, p2, score, diceNum, minPick, didRoll, playerId]);

    useEffect(() => {
        const savedGameState = localStorage.getItem('gameState');
        if (savedGameState) {
            const { p1, p2, s, num, minPick, didRoll } = JSON.parse(savedGameState);
            setP1(p1);
            setP2(p2);
            setScore(s);
            setDiceNum(num);
            setMinPick(minPick);
            setDidRoll(didRoll);
        }
    }, []);

    const rollDice = () => {
        if (!didRoll) {
            socket.emit('rollDice', gameCode);
            setDidRoll(true);
        }
    };

    function showDice(player) {
        if (player === p1.player) {
            return p1.dice.map((d, i) => <div key={i} className={d.locked === false ? styles.dice : styles.diceLocked} onClick={() => handleLock(i)}>
                    <p >{d.value === 0 ? '?' : d.value}</p></div>)
        } else {
            return p2.dice.map((d, i) => <div key={i} className={d.locked === false ? styles.dice : styles.diceLocked} onClick={() => handleLock(i)}>
                    <p >{d.value === 0 ? '?' : d.value}</p></div>)
        }
    }

    function handleLock(idx) {
        //let you;

        if (!didRoll || turn === 0) {
            return;
        }

        let currentPlayer = p1.player === playerId ? p1 : p2;

        // if (p1.player === playerId) {
        //     you = p1;
        // } else {
        //     you = p2;
        // }

        if (currentPlayer.dice[idx].locked) {
            if (currentPlayer.dice[idx].turnLock !== turn && currentPlayer.dice[idx].turnLock !== 0) {
                return;
            }
    
            const scoreAdjustment = currentPlayer.dice[idx].value === 3 ? 0 : currentPlayer.dice[idx].value;
            setScore(prevScore => prevScore - scoreAdjustment);
            setDiceNum(prevDiceNum => prevDiceNum + 1);
            setMinPick(prevMinPick => prevMinPick - 1);
        } else {
            const scoreAdjustment = currentPlayer.dice[idx].value === 3 ? 0 : currentPlayer.dice[idx].value;
            setScore(prevScore => prevScore + scoreAdjustment);
            setDiceNum(prevDiceNum => prevDiceNum - 1);
            setMinPick(prevMinPick => prevMinPick + 1);
        }

        const updatedDice = currentPlayer.dice.map((d, i) => {
            if (i === idx) {
                return {
                    ...d,
                    locked: !d.locked,
                    turnLock: d.locked ? 0 : turn  // Toggle turn lock based on current state
                };
            }
            return d;
        });

        if (p1.player === playerId) {
            setP1(prev => ({ ...prev, dice: updatedDice }));
        } else {
            setP2(prev => ({ ...prev, dice: updatedDice }));
        }
        
        
        // if (you.dice[idx].locked === false) {
        //     if (you.dice[idx].value === 3) {
        //         setScore(score + 0);
        //     } else {
        //         setScore(score + you.dice[idx].value);
        //     }
        //     setDiceNum(diceNum-1);
        //     console.log(`Current Dice Left: ${diceNum}`)
        //     console.log(`Current Score: ${score}`)
        //     setMinPick(minPick+1);
        //     const newDice = you.dice.map((d,i) => {
        //         if (i !== idx) {
        //             return d;
        //         } else {
        //             d.locked = true;
        //             d.turnLock = turn;
        //             return d;
        //         }
        //     })
        //     //console.log(newDice)
        //     setDice(newDice);
        // } else {
        //     if (you.dice[idx].turnLock !== turn && you.dice[idx].turnLock !== 0) {
        //         return;
        //     }
        //     if (you.dice[idx].value === 3) {
        //         setScore(score - 0);
        //     } else {
        //         setScore(score - you.dice[idx].value);
        //     }
        //     setDiceNum(diceNum+1);
        //     console.log(`Current Dice Left: ${diceNum}`)
        //     console.log(`Current Score: ${score}`)
        //     setMinPick(minPick-1);
        //     const newDice = dice.map((d,i) => {
        //         if (i !== idx) {
        //             return d;
        //         } else {
        //             d.locked = false;
        //             d.turnLock = 0;
        //             return d;
        //         }
        //     })
        //     setDice(newDice);
        // }
    }

    const submitDice = () => {
        //console.log(p1)
        if (minPick === 0 && turn !== 0) {
            alert("You must pick at least one die per turn.");
            return;
        }
        const state = JSON.parse(localStorage.getItem('gameState'));
        const n = state.num;
        const s = state.s;
        console.log(state)
        setDidRoll(false);
        socket.emit('submitDice', gameCode, playerId === p1.player ? p1.dice : p2.dice, playerId, s, n);
        setMinPick(0);
    }

    function getWinner() {
        let winner;
        if (p1.score === p2.score) {
            winner = "It's a TIE!";
            return <h1>{winner}</h1>
        } else if (p1.score > p2.score) {
            winner = p2.player;
            return <h1>Winner: {winner}</h1>
        } else {
            winner = p1.player;
            return <h1>Winner: {winner}</h1>
        }
    }

    return (
        <div className={styles.gameCont}>
            {/* <h1>Game: {gameCode}</h1> */}
            
            {gameDone ? getWinner() : <h1>It's {isMyTurn ? "your" : "their"} turn</h1>}
            <div>
                <h1>Opp: {opp}</h1>
                <h2>Score: {p1.player === opp ? p1.score : p2.score}</h2>
                <div className={styles.playerBoard}>
                    {showDice(opp)}
                </div>
            </div>
            
            <div>
                <h1>You: {playerId}</h1>
                <h2>Score: {p1.player === playerId ? p1.score : p2.score}</h2>
                <div className={styles.playerBoard}>
                    {showDice(playerId)}
                </div>
            </div>
            
            <div className={styles.playBtns}>
                <button onClick={rollDice} disabled={!isMyTurn || didRoll || gameDone}>Roll Dice</button>
                <button onClick={submitDice} disabled={!isMyTurn || gameDone || !didRoll}>Submit</button>
            </div>
        </div>
    );
}

export default Multiplayer