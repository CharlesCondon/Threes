import React from 'react'
import styles from './Navbar.module.scss'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleNav = (path) => {
        navigate(path);
        setIsSidebarOpen(false);
    }

    return (
        <div className={styles.navCont}>
            <div className={styles.navBtns}>
                <h1>Threes</h1>
                <div className={styles.hamburger} onClick={toggleSidebar}>
                    &#9776;
                </div>
                <div className={`${window.innerWidth < 768 ? styles.sidebar : styles.navBtns} ${isSidebarOpen ? styles.open : ''}`}>
                    <button onClick={() => handleNav('/')}>HOME</button>
                    <button onClick={() => handleNav('/play')}>PLAY</button>
                    {/* <button disabled={true} onClick={() => navigate('/')}>STATS</button>
                    <button disabled={true} onClick={() => navigate('/')}>HOW TO PLAY</button>
                    <butto
                    </div>
                    n disabled={true} onClick={() => navigate('/')}>LOGIN / SIGNUP</button> */}
                    <div className={styles.navFooter}>
                        <button disabled={true} onClick={() => navigate('/')}>Settings</button>
                        <p>v.0.4</p>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Navbar