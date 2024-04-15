import React from 'react'
import styles from '../Vs.module.scss'

function Rando({ setMode }) {


    
    return (
        <div className={styles.friendCont}>
            <div className={styles.friendText}>
                <h2>Guest</h2>
            </div>
            <img className={styles.friendImg} src='' alt='' />
            <div className={styles.friendText}>
                <h2>Waiting for Opponent...</h2>
                <button onClick={() => setMode(0)}>CANCEL</button>
            </div>
        </div>
    )
}

export default Rando