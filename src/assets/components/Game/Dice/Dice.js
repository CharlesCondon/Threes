import React from 'react'
import styles from './Dice.module.scss'

function Dice( {num, value, turn, diceNum, setDiceNum, setScore, score, dice, setDice, setMinPick, minPick}) {

    function handleLock() {
        if (turn === 0) {
            return;
        }
        
        if (dice[num].locked === false) {
            if (value === 3) {
                setScore(score + 0);
            } else {
                setScore(score + value);
            }
            setDiceNum(diceNum-1);
            setMinPick(minPick+1);
            const newDice = dice.map((d,i) => {
                if (i !== num) {
                    return d;
                } else {
                    d.locked = true;
                    d.turnLock = turn;
                    return d;
                }
            })
            setDice(newDice);
        } else {
            if (dice[num].turnLock !== turn && dice[num].turnLock !== 0) {
                return;
            }
            if (value === 3) {
                setScore(score - 0);
            } else {
                setScore(score - value);
            }
            setDiceNum(diceNum+1);
            setMinPick(minPick-1);
            const newDice = dice.map((d,i) => {
                if (i !== num) {
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

    return (
        <div className={dice[num].locked === false ? styles.dice : styles.diceLocked} onClick={() => handleLock()}>
            <p>{value === 0 ? '?' : value}</p>
        </div>
    )
}

export default Dice