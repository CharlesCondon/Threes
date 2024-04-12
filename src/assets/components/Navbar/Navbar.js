import React from 'react'
import styles from './Navbar.module.scss'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();

    return (
        <div className={styles.navCont}>
            <div className={styles.navBtns}>
                <h1>Threes</h1>
                <button onClick={() => navigate('/')}>HOME</button>
                <button onClick={() => navigate('/play')}>PLAY</button>
                <button onClick={() => navigate('/')}>STATS</button>
                <button onClick={() => navigate('/')}>HOW TO PLAY</button>
                <button onClick={() => navigate('/')}>LOGIN / SIGNUP</button>
            </div>
            <div className={styles.navFooter}>
                <button onClick={() => navigate('/')}>Settings</button>
                <p>v.0.1</p>
            </div>
        </div>
    )
}

export default Navbar