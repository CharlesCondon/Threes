import React from 'react'
import styles from './Home.module.scss'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = 'Threes';
    }, []);

    return (
        <div className={styles.homeCont}>
            <h1>The Game is Threes</h1>
            <h3>Roll 6 dice, lowest score wins</h3>
            <button onClick={() => navigate('/play')}>Play Now</button>
        </div>
    )
}

export default Home