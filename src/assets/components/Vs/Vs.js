import React from 'react'
import styles from './Vs.module.scss'
import { useNavigate } from 'react-router-dom'
import Friend from './modes/Friend'
import Rando from './modes/Rando'

function Vs() {
    const [mode, setMode] = React.useState(0)
    const navigate = useNavigate();

    function loadMode() {
        if (mode === 0) {
            return <>
                <h1>Select Mode</h1>
                <button className={styles.vsSelect} disabled={true} onClick={() => navigate('./')}>Computer</button>
                <button className={styles.vsSelect} onClick={() => setMode(1)}>Find a Game</button>
                <button className={styles.vsSelect} onClick={() => setMode(2)}>Create a Game</button>            
            </>
        } else if (mode === 1) {
            return <>
                <Rando setMode={setMode}></Rando>
            </>
        } else {
            return <>
                <Friend setMode={setMode}></Friend>
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