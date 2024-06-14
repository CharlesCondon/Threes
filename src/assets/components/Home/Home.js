import React from 'react'
import styles from './Home.module.scss'
import { useNavigate } from 'react-router-dom'
import threes from '../../images/number-3.png'

function Home() {
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = 'Threes';
    }, []);

    return (
        <div className={styles.homeCont}>
            {/* <div className={styles.homeDiceCont}>
                <div className={styles.homeDiceBox}>
                    <h2>3</h2>
                </div>
                <div className={styles.homeDiceBox}>
                    <h2>3</h2>
                </div>
                <div className={styles.homeDiceBox}>
                    <h2>3</h2>
                </div>
                <div className={styles.homeDiceBox}>
                    <h2>3</h2>
                </div>
                <div className={styles.homeDiceBox}>
                    <h2>3</h2>
                </div>
                <div className={styles.homeDiceBox}>
                    <h2>3</h2>
                </div>
            </div> */}
            <h1>The Game is Threes</h1>
            {/* <img src={threes} alt='' /> */}
            <h3>Roll 6 dice, lowest score wins</h3>
            <button onClick={() => navigate('/play')}>Play Now</button>
        </div>
    )
}

export default Home