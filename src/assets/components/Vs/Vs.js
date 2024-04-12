import React from 'react'
import styles from './Vs.module.scss'
import { useNavigate } from 'react-router-dom'

function Vs() {
    const [mode, setMode] = React.useState(0)
    const navigate = useNavigate();

    function changeMode(m) {
        setMode(m)
    }

    function loadMode() {
        if (mode === 0) {
            return <>
                <h1>Select Mode</h1>
                <button className={styles.vsSelect} onClick={() => navigate('./computer')}>Computer</button>
                <button className={styles.vsSelect} onClick={() => changeMode(1)}>Find a Game</button>
                <button className={styles.vsSelect} onClick={() => changeMode(2)}>Challenge a Friend</button>            
            </>
        } else if (mode === 1) {
            return <>
                <div className={styles.friendCont}>
                    <div className={styles.friendText}>
                        <h2>Guest</h2>
                    </div>
                    <img className={styles.friendImg} src='' alt='' />
                    <div className={styles.friendText}>
                        <h2>Waiting for Opponent...</h2>
                        <button onClick={() => changeMode(0)}>CANCEL</button>
                    </div>
                </div>
            </>
        } else {
            return <>
                <div className={styles.friendCont}>
                    <div className={styles.friendText}>
                        <h2>Guest</h2>
                        <button>SEND INVITE</button>
                    </div>
                    <img className={styles.friendImg} src='' alt='' />
                    <div className={styles.friendText}>
                        <h2>Waiting for Opponent...</h2>
                        <button onClick={() => changeMode(0)}>CANCEL</button>
                    </div>
                </div>
            </>
        }
    }

    return (
        <div className={styles.vsCont}>
            {loadMode()}
        </div>
    )
}

export default Vs