import React from 'react'
import styles from './Home.module.scss'
import { useNavigate } from 'react-router-dom'

const initialDice = [3,3,3,3,3,3];

function Home() {
    const [dice, setDice] = React.useState(initialDice);
    const [styleChange, setStyleChange] = React.useState(false);
    const navigate = useNavigate();
    const intervalRef = React.useRef(null);

    React.useEffect(() => {
        document.title = 'Threes';
    }, []);

    function handleRoll() {
        clearInterval(intervalRef.current);
        setStyleChange(true);
        intervalRef.current = setInterval(() => {
            const newDice = dice.map((d) => { 
                d = Math.floor(Math.random()*6+1);
                return d
            })
            setDice(newDice)
        }, 30);

        setTimeout(() => {
            clearInterval(intervalRef.current);
            setDice(initialDice);
            setStyleChange(false);
        }, 500);
    }

    return (
        <div className={styles.homeCont}>
            <div className={styles.homeHead}>
                <h1 className={styles.headTitle}>Threes</h1>
                <h3>Roll 6 dice, lowest score wins</h3>
            </div>
            <button onClick={() => navigate('/play')}>Play Now</button>
            <div className={styles.homeDiceCont}>
                {dice.map((d,i) => {
                    return <div key={i} onClick={() => handleRoll()} className={`${styles.homeDiceBox} ${styleChange ? styles.activeDiceBox : ''}`}>
                                <h2>{d}</h2>
                            </div>
                })}
            </div>
        </div>
    )
}

export default Home