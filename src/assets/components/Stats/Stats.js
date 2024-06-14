import React from 'react'
import styles from './Stats.module.scss'
import three from '../../images/number-3.png'

function Stats() {
    const [games, setGames] = React.useState(0)
    const [wins, setWins] = React.useState(0)
    const [curStreak, setCurStreak] = React.useState(0)
    const [maxStreak, setmaxStreak] = React.useState(0)
    const [bestScore, setBestScore] = React.useState(0)

    React.useEffect(() => {
        document.title = 'Threes | Stats';

        let storedStats = JSON.parse(localStorage.getItem('stats'));
        if (storedStats) {
            setGames(storedStats.games);
            setWins(storedStats.wins);
            setCurStreak(storedStats.curStreak);
            setmaxStreak(storedStats.maxStreak);
            setBestScore(storedStats.bestScore);
        }
    }, []);

    return (
        <div className={styles.statsCont}>
            <div className={styles.statsHead}>
                <img src={three} alt='' />
            </div>

            <div className={styles.statsInfo}>
                <h1>Multiplayer Statistics</h1>
                <div className={styles.statList}>
                    <div className={styles.statItem}>
                        <h2>{games ? games : 'X'}</h2>
                        <p>Games</p>
                    </div>
                    <div className={styles.statItem}>
                        <h2>{wins ? wins : 'X'}</h2>
                        <p>Wins</p>
                    </div>
                    <div className={styles.statItem}>
                        <h2>{wins && games ? Math.round((wins / games)*100) : 'X'}</h2>
                        <p>Win %</p>
                    </div>
                    <div className={styles.statItem}>
                        <h2>{curStreak ? curStreak : 'X'}</h2>
                        <p>Current<br></br>Streak</p>
                    </div>
                    <div className={styles.statItem}>
                        <h2>{maxStreak ? maxStreak : 'X'}</h2>
                        <p>Max<br></br>Streak</p>
                    </div>
                    <div className={styles.statItem}>
                        <h2>{bestScore ? bestScore : 'X'}</h2>
                        <p>Best<br></br>Score</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stats