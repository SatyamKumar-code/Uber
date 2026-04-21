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

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });

            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                console.log('Invalid location data:', location);
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });

            // Emit live location to user if ride is accepted or ongoing
            const rideModel = require('./models/ride.model');
            const ride = await rideModel.findOne({ captain: userId, status: { $in: ['accepted', 'ongoing'] } }).populate('user');
            if (ride && ride.user && ride.user.socketId) {
                sendMessageToSocketId(ride.user.socketId, {
                    event: 'captain-location',
                    data: {
                        captainId: userId,
                        location: {
                            ltd: location.ltd,
                            lng: location.lng
                        },
                        rideId: ride._id
                    }
                });
            }
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