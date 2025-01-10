const socketI0 = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketI0(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user'){
                await userModel.findByIdAndUpdate(userId, {socketId: socket.id });
                
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, { location:{
                ltd: location.ltd,
                lng: location.lng
            } });
        });

    });
}

function sendMessageToSocketId(socketId, messageObject) {

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io is not initialized');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };