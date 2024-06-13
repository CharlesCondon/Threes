import React from 'react'
import styles from './Play.module.scss'
import { useNavigate } from 'react-router-dom'

function Play() {
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = 'Threes';
    }, []);
    
    return (
        <div className={styles.playCont}>
            <h1>Select Mode</h1>
            <button onClick={() => navigate('./solo')}>Solo</button>
            <button onClick={() => navigate('./vs')}>VS</button>
        </div>
    )
}

export default Play