import {Routes, Route} from 'react-router-dom';
import styles from './App.module.scss';
import Home from './assets/components/Home/Home';
import Game from './assets/components/Game/Game';
import Play from './assets/components/Play/Play';
import Navbar from './assets/components/Navbar/Navbar';
import Vs from './assets/components/Vs/Vs';
import Multiplayer from './assets/components/Multiplayer/Multiplayer';
import SocketProvider from './assets/context/SocketProvider';
import Stats from './assets/components/Stats/Stats';

function App() {
	return (
		<div className={styles.App}>
			<Navbar></Navbar>
			<Routes>
				<Route index path='/' element={
					<Home/>
				}/>
				<Route path='/play' element={
					<Play/>
				} />
				<Route path='/stats' element={
					<Stats/>
				} />
				<Route path='/play/solo' element={
					<Game/>
				} />
				<Route path='/play/vs' element={
					<SocketProvider>
						<Vs/>
					</SocketProvider>
				} />
				<Route path='/play/vs/:gameCode' element={
					<SocketProvider>
						<Multiplayer/>
					</SocketProvider>
				} />
				
			</Routes>
		</div>
	);
}

export default App;
