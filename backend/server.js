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
        const gameCode = Math.random().toString(36).substring(2, 10); // Generate random game code
        games[gameCode] = { 
            players: [userId],
            turn: userId,
            turnNum: 0,
            dice: [],
            done: false,
            p1: {player: userId, dice: cloneDice(initialDice), turnNum: 0, diceLeft: 6, score: 0, done:false},
            p2: {player: "", dice: cloneDice(initialDice), turnNum: 0, diceLeft: 6, score: 0, done:false}
        }; // Create a new game with one player
        // games[gameCode].p1.map((v) => v.player = userId)
        console.log("creating game")
        socket.join(gameCode);
        socket.emit('gameCreated', gameCode);
    });

    socket.on('joinGame', (gameCode) => {
        if (games[gameCode] && games[gameCode].players.length < 2) {
            games[gameCode].players.push(userId); // Add player to the game
            games[gameCode].p2.player = userId;
            socket.join(gameCode);
            socket.emit('gameJoined', {});
            console.log("player joined game")
            //console.log(games[gameCode])
            io.to(gameCode).emit('gameStart', games[gameCode]); // Notify all players to start the game
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
            if (!games[gameCode].players.includes(userId)) {
                games[gameCode].players.push(userId);
            }
            console.log('existing game')
            //console.log(games[gameCode])
            io.to(gameCode).emit('gameState', games[gameCode]);
        }
    });

    socket.on('rollDice', (gameCode) => {
        if (games[gameCode].turn === userId) {
            // Example dice roll logic, adjust per game rules
            console.log("rolling dice")
            games[gameCode].turnNum += 1;
            games[gameCode].dice = Array.from({ length: 6 }, () => Math.floor(Math.random() * 6) + 1);

            if (games[gameCode].turn === games[gameCode].players[0]) {
                games[gameCode].p1.dice.map((v,i) => {
                    if (!v.locked) {
                        return v.value = games[gameCode].dice[i]
                    } else {
                        return v.value;
                }});
            } else {
                games[gameCode].p2.dice.map((v,i) => {
                    if (!v.locked) {
                        return v.value = games[gameCode].dice[i]
                    } else {
                        return v.value;
                    }});
            }
            
            //games[gameCode].turn = games[gameCode].players.find(id => id !== userId);
            //console.log(games[gameCode])
            io.to(gameCode).emit('gameState', games[gameCode]);
        }
    });

    socket.on('submitDice', (gameCode, dice, playerId, score, diceNum) => {
        //console.log(diceNum)
        console.log("submitting dice")
        if (games[gameCode].turn === playerId) {
            const opp = games[gameCode].players.find(id => id !== userId);
            // update if player 1
            if (games[gameCode].p1.player === playerId) {
                games[gameCode].p1.dice = dice;
                games[gameCode].p1.score = score;
                games[gameCode].p1.diceLeft = diceNum;
                
                if (diceNum === 0) {
                    games[gameCode].p1.done = true;
                }
                if (!games[gameCode].p2.done) {
                    games[gameCode].turn = opp;
                }
                console.log(games[gameCode].p1)
            // update if player 2
            } else {
                games[gameCode].p2.dice = dice;
                games[gameCode].p2.score = score;
                games[gameCode].p2.diceLeft = diceNum;
                if (diceNum === 0) {
                    games[gameCode].p2.done = true;
                }
                if (!games[gameCode].p1.done) {
                    games[gameCode].turn = opp;
                }
                console.log(games[gameCode].p2)
            }
            console.log(games[gameCode])
            //console.log(games[gameCode].p1)
            
            if (games[gameCode].p2.done && games[gameCode].p1.done) {
                games[gameCode].done = true;
            }
            io.to(gameCode).emit('gameState', games[gameCode]);
        }
        
    })

});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
