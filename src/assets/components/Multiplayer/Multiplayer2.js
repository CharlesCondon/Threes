import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SocketContext from '../../context/SocketContext';
import styles from './Multiplayer.module.scss'
import Dice from '../Game/Dice/Dice';

const initialDice = [
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0}
];

function Multiplayer2() {
    const { gameCode } = useParams();
    const [dice, setDice] = useState(initialDice);
    const [diceNum, setDiceNum] = useState(6);
    const [minPick, setMinPick] = useState(0);
    const [score, setScore] = useState(0);
    const [topScore, setTopScore] = useState(0);
    const [turn, setTurn] = useState(0);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [playerId, setPlayerId] = useState();
    const [players, setPlayers] = useState([{id:'P1'}]);
    const [rollNum, setRollNum] = useState(0);
    const [gameDone, setGameDone] = useState(false);
    const [gameWinner, setGameWinner] = useState("");
    const intervalRef = useRef(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (socket) {
            //console.log(socket._opts.query.userId)
            socket.emit('joinRoom', gameCode);
            setPlayerId(socket._opts.query.userId);

            const handleGameState = (state) => {
                setTurn(state.turnNum);
                setIsMyTurn(state.turn === playerId);
                setPlayers(state.players);
                setTopScore(state.topScore);
                setScore(state.score);
                setRollNum(state.rollNum);
                setDice(state.dice);
                setDiceNum(state.diceLeft);
                setGameDone(state.done);
                setGameWinner(state.winner.pos);
            };

            socket.on('gameState', handleGameState);

            return () => {
                socket.off('gameState', handleGameState); // Cleanup listener
            };
            
            // socket.on('gameState', (state) => {
            //     //console.log(state)
            //     // setP1(state.p1)
            //     // setP2(state.p2)
            //     // setOpp(state.players.find(id => id !== playerId))
            //     // // setDice(state.dice);
            //     setTurn(state.turnNum);
            //     setIsMyTurn(state.turn === playerId);
            //     console.log(state.players)
            //     setPlayers(state.players);
            //     // setGameDone(state.done)
            // });
    
            // socket.on('connect', () => {
            //     setPlayerId(socket._opts.query.userId);
            // });
    
            // return () => {
            //     socket.off('connect');
            //     socket.off('gameState');
            // };
        }
        
    }, [gameCode, playerId, socket]);

    const handleSubmit = () => {
        console.log(score)
        socket.emit('submitDice', gameCode, score)
        // if (!localStorage.getItem("scores")) {
        //     console.log('nothing')
        //     localStorage.setItem("scores", JSON.stringify([{score:score,turn:turn}]))
        // } else {
        //     localStorage.setItem("scores", JSON.stringify([...storedScores,{score:score,turn:turn}]))
        // }
        // setStoredScores(() => {
        //     const s = localStorage.getItem("scores")
        //     const initialScores = JSON.parse(s)
        //     const sortedScores = initialScores.sort((a,b) => a.score - b.score);
        //     return sortedScores || "";
        // })
        // setScore(0);
        // setDice(initialDice);
        // setTurn(0);
        // setDiceNum(6);
    }

    const rollDice = () => {
        console.log(minPick)
        if (diceNum + rollNum > 6) {
            return;
        }
        if (diceNum === 0) {
            return;
        }
        if (minPick === 0 && rollNum !== 0) {
            alert("You must pick at least one die per turn.");
            return;
        }
        clearInterval(intervalRef.current);
    
        intervalRef.current = setInterval(() => {
            const newDice = dice.map((d) => { 
                if (d.locked === true) {
                    return d;
                } else {
                    d.value = Math.floor(Math.random()*6+1);
                    return d;
                }
            })
            setDice(newDice)
            
        }, 30);

        setTimeout(() => {
            clearInterval(intervalRef.current);
            socket.emit('rollDice', gameCode, dice, diceNum, score);
        }, 750);
        setMinPick(0);   
    };

    return (
        <div className={styles.gameCont}>
            
            <div className={styles.playerListCont}>
                <p>Game Code: {gameCode}</p>
                <div className={styles.playerList}>
                    {players.map((p,i) => {
                        return <span className={(turn===i) ? styles.currentPlayer : ''} key={i}>P{i+1}</span>
                    })}
                </div>
                
            </div>
            
            {gameDone ? <h1>WINNER: P{gameWinner+1}</h1>
            : <h1>Score To Beat: {topScore}</h1>}
            
            <div className={styles.scorecard}>
                <h2>Turn: P{turn+1}</h2>
                <h2>Score: {score}</h2>
            </div>
            <div className={styles.playerBoard}>
                {/* {dice.forEach((d,i) => {
                    return <Dice num={i} value={dice[i].value} turn={turn} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice}></Dice>
                })} */}
                <Dice num={0} value={dice[0].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={1} value={dice[1].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={2} value={dice[2].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={3} value={dice[3].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={4} value={dice[4].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={5} value={dice[5].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
            </div>

            <div className={styles.playBtns}>
                {diceNum === 0 
                    ? <button onClick={handleSubmit}>Submit</button>
                    : <button disabled={!isMyTurn} onClick={rollDice}>Roll</button>}
            </div>
            
            <div className={styles.statsCont}>
                <h1>Roll #: {rollNum}</h1>
                <h1>Dice Left: {diceNum}</h1>
            </div>
        </div>
    )
}

export default Multiplayer2