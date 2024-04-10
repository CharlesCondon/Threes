import React from 'react'
import styles from './Home.module.scss'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();

    return (
        <div className={styles.homeCont}>
            <h1>The Game is Threes</h1>
            <ul>
                <li>Take turns rolling 6 dice</li>
                <li>Each turn, pick at least one dice to lock in</li>
                <li>Keep rolling and picking until all dice are locked in</li>
                <li>Lowest score wins</li>
                <li>Threes equal 0</li>
            </ul>
            <button onClick={() => navigate('/play')}>Play Now</button>
        </div>
    )
}

export default Home