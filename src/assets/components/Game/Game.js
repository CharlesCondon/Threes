import React, {useRef, useState} from 'react'
import styles from './Game.module.scss'
import Dice from './Dice/Dice';

function Game() {
    const initialDice = [
        {value:0, locked:false, turnLock:0},
        {value:0, locked:false, turnLock:0},
        {value:0, locked:false, turnLock:0},
        {value:0, locked:false, turnLock:0},
        {value:0, locked:false, turnLock:0},
        {value:0, locked:false, turnLock:0}
    ];
    const [score, setScore] = useState(0);
    const [dice, setDice] = useState(initialDice);
    const [diceNum, setDiceNum] = useState(6);
    const [turn, setTurn] = useState(0);
    const [minPick, setMinPick] = useState(0);
    const [hideScore, setHideScore] = useState(true);
    const [hideHelp, setHideHelp] = useState(true);
    const [storedScores, setStoredScores] = useState(() => {
        const s = localStorage.getItem("scores")
        const initialScores = JSON.parse(s) 
        return initialScores || "";
    });
    const intervalRef = useRef(null);

    React.useEffect(() => {
        document.title = 'Threes | Solo';
    }, []);

    function handleRoll() {
        if (diceNum + turn > 6) {
            return;
        }
        if (diceNum === 0) {
            return;
        }
        if (minPick === 0 && turn !== 0) {
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
        }, 1000);

        setTurn(turn+1);
        setMinPick(0);
    }
    
    function handleSubmit() {
        if (!localStorage.getItem("scores")) {
            console.log('nothing')
            localStorage.setItem("scores", JSON.stringify([{score:score,turn:turn}]))
        } else {
            localStorage.setItem("scores", JSON.stringify([...storedScores,{score:score,turn:turn}]))
        }
        setStoredScores(() => {
            const s = localStorage.getItem("scores")
            const initialScores = JSON.parse(s)
            const sortedScores = initialScores.sort((a,b) => a.score - b.score);
            return sortedScores || "";
        })
        setScore(0);
        setDice(initialDice);
        setTurn(0);
        setDiceNum(6);
    }

    function toggleScores() {
        setHideScore(!hideScore)
    }
    function toggleHelp() {
        setHideHelp(!hideHelp)
    }

    function resetScores() {
        localStorage.removeItem("scores")
        setStoredScores()
    }

    return (
        <div className={styles.board}>
            <button className={styles.scoreBtn} onClick={() => toggleScores()}>Scores</button>
            {hideScore ?  <></>
                : <div className={styles.scoreList}>
                    <h3>Hi-Scores</h3>
                    <ul>
                        {storedScores ? storedScores.map((s,i) => {
                            return <div key={i} className={styles.individualScore}>
                                <p>Score: {s.score}</p>
                                <p>Turn: {s.turn}</p>
                            </div>
                        }) : <></>}
                    </ul>
                    <button className={styles.resetScores} onClick={() => resetScores()}>Reset Scores</button>
                </div>}
            <button className={styles.helpBtn} onClick={() => toggleHelp()}>?</button>
            {hideHelp ?  <></>
                : <div className={styles.helpModal}>
                    <button onClick={() => toggleHelp()}>X</button>
                    <h2>How To Play</h2>
                    <h3>Get the lowest combined dice score.</h3>
                    <div>
                        <ul>
                            <li>After each roll, select at least one die to lock in.</li>
                            <li>Keep rolling until all dice are locked in.</li>
                            <li>The lower the score, the better.</li>
                            <li>Threes equal zero.</li>
                        </ul>
                    </div>
                </div>}
            <div className={styles.gameCont}>
                {/* <h1>Play</h1> */}
                <div className={styles.scorecard}>
                    <h1>Score: {score}</h1>
                </div>
                <div className={styles.playerBoard}>
                    {/* {dice.forEach((d,i) => {
                        return <Dice num={i} value={dice[i].value} turn={turn} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice}></Dice>
                    })} */}
                    <Dice num={0} value={dice[0].value} turn={turn} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                    <Dice num={1} value={dice[1].value} turn={turn} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                    <Dice num={2} value={dice[2].value} turn={turn} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                    <Dice num={3} value={dice[3].value} turn={turn} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                    <Dice num={4} value={dice[4].value} turn={turn} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                    <Dice num={5} value={dice[5].value} turn={turn} setDiceNum={setDiceNum} diceNum={diceNum} setScore={setScore} score={score} dice={dice} setDice={setDice} setMinPick={setMinPick} minPick={minPick}></Dice>
                </div>

                <div className={styles.playBtns}>
                    {diceNum === 0 
                        ? <div className={styles.finishBtns}>
                            <button onClick={() => handleSubmit()}>Submit</button>
                        </div> 
                        : <button onClick={() => handleRoll()}>Roll</button>}
                </div>
                
                <div className={styles.statsCont}>
                    <h2>Turn: {turn}</h2>
                    <h2>Dice Left: {diceNum}</h2>
                </div>
                
                
                
            </div>
        </div>
    )
}

export default Game