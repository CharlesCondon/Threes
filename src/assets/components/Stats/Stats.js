import React from 'react'
import styles from './Stats.module.scss'
import three from '../../images/number-3.png'

function Stats() {

    React.useEffect(() => {
        document.title = 'Threes | Stats';
    }, []);

    return (
        <div className={styles.statsCont}>
            <div className={styles.statsHead}>
                <img src={three} alt='' />
            </div>

            <div className={styles.statsInfo}>
                <h2>Multiplayer Statistics</h2>
                
            </div>
        </div>
    )
}

export default Stats