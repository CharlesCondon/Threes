import React from 'react'
import styles from './Navbar.module.scss'
import { useNavigate } from 'react-router-dom'
import threes from '../../images/number-3.png'

function Navbar() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleNav = (path) => {
        navigate(path);
        setIsSidebarOpen(false);
    }

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={styles.navCont}>
            <div className={styles.navBtns}>
                {/* <h1>Threes</h1> */}
                <div onClick={() => handleNav('/')} className={styles.navImg}>
                    <img src={threes} alt='' />
                </div>
                {isMobile ? (
                    <>
                        <div className={styles.hamburger} onClick={toggleSidebar}>
                            &#9776;
                        </div>
                        <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                            <button onClick={() => handleNav('/')}>HOME</button>
                            <button onClick={() => handleNav('/play')}>PLAY</button>
                            <button onClick={() => handleNav('/stats')}>STATS</button>
                            {/* <button disabled={true} onClick={() => handleNav('/')}>HOW TO PLAY</button> */}
                            {/* <button disabled={true} onClick={() => navigate('/')}>LOGIN / SIGNUP</button> */}
                            <div className={styles.navFooter}>
                                {/* <button disabled={true} onClick={() => navigate('/')}>Settings</button> */}
                                <p>v.1.0</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.navBtns}>
                        <button onClick={() => handleNav('/')}>HOME</button>
                        <button onClick={() => handleNav('/play')}>PLAY</button>
                        <button onClick={() => handleNav('/stats')}>STATS</button>
                        <div className={styles.navFooter}>
                            <p>v.0.6</p>
                        </div>
                    </div>
                )}
                
            </div>
            
        </div>
    )
}

export default Navbar