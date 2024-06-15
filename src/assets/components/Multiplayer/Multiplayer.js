import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SocketContext from '../../context/SocketContext';
import styles from './Multiplayer.module.scss'
import Dice from '../Game/Dice/Dice';
import Chat from './Chat/Chat';
import shareImg from '../../images/share.png';
import chatImg from '../../images/comment.png';

const initialDice = [
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0}
];

function Multiplayer() {
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
    const [pNum, setPnum] = useState({id:'P1',pos:0})
    const [rollNum, setRollNum] = useState(0);
    const [gameDone, setGameDone] = useState(false);
    const [gameWinner, setGameWinner] = useState([{id:'P1',pos:0}]);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const intervalRef = useRef(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        document.title = 'Threes | Multiplayer';
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit('joinRoom', gameCode);
            setPlayerId(socket._opts.query.userId);

            const handleGameState = (state) => {
                if (state.turnNum === 0) {
                    localStorage.setItem("currentGameProcessed", JSON.stringify(false));
                }
                setTurn(state.turnNum);
                setIsMyTurn(state.turn === playerId);
                setPlayers(state.players);
                setPnum(state.players.find(player => player.id === playerId))
                setTopScore(state.topScore);
                setScore(state.score);
                setRollNum(state.rollNum);
                setDice(state.dice);
                setDiceNum(state.diceLeft);
                setGameDone(state.done);
                setGameWinner(state.winner);
                setChatHistory(state.chat);
            };

            const handleRematch = (state) => {
                localStorage.setItem("currentGameProcessed", JSON.stringify(false));
                setTurn(state.turnNum);
                setIsMyTurn(state.turn === playerId);
                setPlayers(state.players);
                setPnum(state.players.find(player => player.id === playerId))
                setTopScore(state.topScore);
                setScore(state.score);
                setRollNum(state.rollNum);
                setDice(state.dice);
                setDiceNum(state.diceLeft);
                setGameDone(state.done);
                setGameWinner(state.winner);
            }

            socket.on('gameState', handleGameState);
            socket.on('rematch', handleRematch);

            return () => {
                socket.off('gameState', handleGameState); // Cleanup listeners
                socket.off('rematch', handleRematch);
            };
        }
        
    }, [gameCode, playerId, socket]);

    useEffect(() => {
        const gameProcessed = localStorage.getItem("currentGameProcessed");

        console.log("game done: " + gameDone)
        console.log("game processed: " + gameProcessed)

        if (gameDone && !JSON.parse(gameProcessed)) {
            console.log('processing game')
            processWinner(gameWinner);
            localStorage.setItem("currentGameProcessed", JSON.stringify(true));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameDone, gameWinner]);

    const handleSubmit = () => {
        socket.emit('submitDice', gameCode, score)
    }

    const rollDice = () => {
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

    const rematch = () => {
        socket.emit('rematch', gameCode);
    }

    const processWinner = (winners) => {
        let stats = localStorage.getItem("stats");
        console.log(stats)
        if (!stats) {
            stats = {games:1, wins:0, bestScore:pNum.score, curStreak:0, maxStreak:0};
        } else {
            stats = JSON.parse(stats);
            stats.games += 1;
        }

        const curWinner = winners.find((w) => w.pos === pNum.pos);

        if (curWinner) { // If you are a winner
            if (pNum.score < stats.bestScore) {
                stats.bestScore = pNum.score;
            }
            stats.wins += 1;
            stats.curStreak += 1;
            if (stats.curStreak > stats.maxStreak) {
                stats.maxStreak = stats.curStreak;
            }
        } else { // If you did not win
            if (pNum.score < stats.bestScore) {
                stats.bestScore = pNum.score;
            }
            stats.curStreak = 0;
        }
        console.log(stats)
        localStorage.setItem("stats", JSON.stringify(stats));
    };

    const renderWinner = (winners) => {
        if (winners.length === 1) { // one winner
            return <><h2>WINNER:</h2><h1>P{winners[0].pos+1}</h1></>
        } else if (winners.length > 1) { // tie game
            return <><h2>TIE:</h2>{winners.map((w,i) => {
                if (i !== winners.length-1) {
                    return <div key={i}><h1>P{w.pos+1}</h1><h2 className={styles.tieAnd}>&</h2></div>
                }
                return <div key={i}><h1>P{w.pos+1}</h1></div>})}</>
        }
        return;
    }
    
    const toggleChat = () => {
        setChatOpen(!chatOpen);
    };

    return (
        <div className={styles.gameCont}>
            <Chat gameCode={gameCode} players={players} chat={chatHistory} open={chatOpen}/>
            
            
            <div className={styles.gameCodeCont}>
                <div>
                    <span>Room:</span><p>{gameCode}</p>
                </div>
                <div>
                    {/* <button><img src={shareImg} alt='' /></button> */}
                    <button onClick={toggleChat}><img src={chatImg} alt='' /></button>
                </div>
            </div>
            <div className={styles.playerListCont}>
                
                
                <div className={styles.playerList}>
                    {players.map((p,i) => {
                        return <span className={(turn===i) ? styles.currentPlayer : ''} key={i}>P{i+1}</span>
                    })}
                </div>
                
            </div>
            
            <div className={styles.topScore}>
                {gameDone ? renderWinner(gameWinner)
                : <><h2>Score To Beat:</h2><h1>{topScore}</h1></>}
            </div>
            
            <div className={styles.scorecard}>
                <h3>You: {pNum ? `P${pNum.pos+1}` : 'Loading...'}</h3>
                <h3>Score: {score}</h3>
            </div>
            <div className={styles.playerBoard}>
                <Dice num={0} value={dice[0].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={1} value={dice[1].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={2} value={dice[2].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={3} value={dice[3].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={4} value={dice[4].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                <Dice num={5} value={dice[5].value} turn={rollNum} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
            </div>
            
            {gameDone && playerId===players[0].id ? <div className={styles.playBtns}><button onClick={rematch}>Rematch</button></div>
            :<div className={styles.playBtns}>
                {diceNum === 0 
                    ? <button onClick={handleSubmit}>Submit</button>
                    : <button disabled={!isMyTurn || players.length < 2} onClick={rollDice}>Roll</button>}
            </div>}
            
            
            
            <div className={styles.statsCont}>
                <h3>Roll #: {rollNum}</h3>
                <h3>Dice Left: {diceNum}</h3>
            </div>
        </div>
    )
}

export default Multiplayer