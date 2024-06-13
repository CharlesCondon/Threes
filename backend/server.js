const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: ["http://localhost:3000","https://threes-psi.vercel.app"], // Adjust according to your security requirements
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}

app.use(cors(corsOptions)); // Enable CORS

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000","https://threes-psi.vercel.app"], // Adjust according to your security requirements
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

let games = {};  // Stores game state, indexed by game code
const users = {};
const initialDice = [
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0},
    {value:0, locked:false, turnLock:0}
];

class Player {
    constructor(userId, pos) {
        this.id = userId;
        this.score = 0;
        this.pos = pos;
    }
}


function cloneDice(dice) {
    return dice.map((d) => ({...d}));
}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User with ID ${userId} connected with socket ID ${socket.id}`);

    if (users[userId]) {
        // User exists, update their socket ID
        users[userId].socketId = socket.id;
    } else {
        // New user
        users[userId] = { socketId: socket.id };
    }

    socket.on('createGame', () => {
        const gameCode = Math.random().toString(36).substring(2, 8); // Generate random game code
        games[gameCode] = { 
            players: [new Player(userId, 0)],
            turn: userId,
            score: 0,
            topScore: 0,
            rollNum: 0,
            turnNum: 0,
            diceLeft: 6,
            dice: cloneDice(initialDice),
            done: false,
            winner: ''
        }; // Create a new game with one player
        console.log("creating game");
        socket.join(gameCode);
        socket.emit('gameCreated', gameCode);
    });

    socket.on('joinGame', (gameCode) => {
        if (games[gameCode] && games[gameCode].players.length < 6) {

            const existingPlayer = games[gameCode].players.find(player => player.id === userId);

            if (!existingPlayer) {
                games[gameCode].players.push(new Player(userId, games[gameCode].players.length));
                socket.join(gameCode);
                socket.emit('gameJoined', { gameCode, player: userId });
                console.log(`Player ${userId} joined game ${gameCode}`);
            } else {
                console.log(`Player ${userId} already in game ${gameCode}`);
            }
            console.log(games[gameCode])
            //io.to(gameCode).emit('gameStart', games[gameCode]); // Notify all players to start the game
        } else {
            socket.emit('error', 'Game is full or does not exist');
        }
    });

    // Additional event handlers for game logic
    socket.on('joinRoom', (gameCode) => {
        socket.join(gameCode);
        if (!games[gameCode]) {
            // console.log('new game')
            // games[gameCode] = {
            //     players: [userId],
            //     turn: userId,
            //     dice: []
            // };
            //alert("game does not exist")
        } else {
            const existingPlayer = games[gameCode].players.find(player => player.id === userId);
            if (!existingPlayer) {
                games[gameCode].players.push(new Player(userId));
            }
            console.log('joining room')
            //console.log(games[gameCode])
            io.to(gameCode).emit('gameState', games[gameCode]);
        }
    });

    socket.on('rollDice', (gameCode, dice, diceNum, score) => {
        if (games[gameCode].turn === userId) {
            games[gameCode].dice = dice;
            games[gameCode].diceLeft = diceNum;
            games[gameCode].score = score;
            
            // Example dice roll logic, adjust per game rules
            console.log("rolling dice")
            games[gameCode].rollNum += 1;
            io.to(gameCode).emit('gameState', games[gameCode]);
        }
    });

    socket.on('submitDice', (gameCode, score) => {
        if (games[gameCode].turn === userId) {
            games[gameCode].players[games[gameCode].turnNum].score = score;
            
            if (games[gameCode].topScore > score || games[gameCode].turnNum === 0) { // update game if new hi-score
                games[gameCode].topScore = score;
            }

            if ((games[gameCode].turnNum + 1) === games[gameCode].players.length) { // check if last person
                games[gameCode].done = true;
                const winner = games[gameCode].players.find(player => player.score === games[gameCode].topScore)
                games[gameCode].winner = winner;
                games[gameCode].turn = "";
            } else { // next player's turn
                games[gameCode].turnNum += 1;
                const nextPlayer = games[gameCode].players[games[gameCode].turnNum]
                games[gameCode].turn = nextPlayer.id;
            }

            // reset game for next player
            games[gameCode].dice = cloneDice(initialDice);
            games[gameCode].score = 0;
            games[gameCode].rollNum = 0;
            games[gameCode].diceLeft = 6;
            console.log(games[gameCode]);
            io.to(gameCode).emit('gameState', games[gameCode]);
        }
    })
    socket.on('rematch', (gameCode) => {
        games[gameCode].turn = userId;
        games[gameCode].score = 0;
        games[gameCode].topScore = 0;
        games[gameCode].rollNum = 0;
        games[gameCode].turnNum = 0;
        games[gameCode].diceLeft = 6;
        games[gameCode].dice = cloneDice(initialDice);
        games[gameCode].done = false;
        games[gameCode].winner = '';
        // = { 
        //     players: [new Player(userId, 0)],
        //     turn: userId,
        //     score: 0,
        //     topScore: 0,
        //     rollNum: 0,
        //     turnNum: 0,
        //     diceLeft: 6,
        //     dice: cloneDice(initialDice),
        //     done: false,
        //     winner: ''
        // }; // Create a new game with one player
        io.to(gameCode).emit('gameState', games[gameCode]);
    })
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
