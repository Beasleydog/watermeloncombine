//Hosted at https://glitch.com/edit/#!/ballcombineserver

const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:8080", "https://ballcombine.vercel.app"]
    }
});

const statesCache = {};

io.on('connection', client => {
    client.on('event', data => {
        if (data.type == "updateState") {
            const gameId = data.gameId;
            client.gameId = gameId;

            const state = data.state;

            statesCache[gameId] = state;
        } else if (data.type == "getStates") {
            client.emit('state', statesCache);
        } else if (data.type == "getState") {
            const gameId = data.gameId;
            client.emit('state', statesCache[gameId]);
        }
    });
    client.on('disconnect', () => {
        const gameId = client.gameId;
        delete statesCache[gameId];
    });
});

server.listen(3000);