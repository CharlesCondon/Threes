import React from 'react'
import styles from './Navbar.module.scss'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();

    return (
        <div className={styles.navCont}>
            <h1>Threes</h1>
            <button onClick={() => navigate('/')}>Home</button>
            <button onClick={() => navigate('/play')}>Play</button>
        </div>
    )
}

export default Navbar