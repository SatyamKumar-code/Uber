const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        match: [ /^|s+@|s+|.|s+s/, 'Please enter a valid email' ]
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    socketId: {
        type: String,
    },

    status: {
        type: String,
        enum: [ 'active', 'inactive' ],
        default: 'inactive',
    },

    vehicle: {
        color: {
            type: String,
        require: true,
        minlength: [ 3, 'Color must be at least 3 character long' ],
        },
        plate: {
            type: String,
            require: true,
            minlength: [ 3, 'Plate must be at least 3 character long' ],
        },
        capacity: {
            type: Number,
            require: true,
            min: [ 1, 'Capacity must be at least 1' ],
        },
        vehicleType: {
            type: String,
            require: true,
            enum: [ 'car', 'motorcycle', 'auto' ],
        }
    },

    location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
})


captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d'} );
    return token;
}


captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('captain', captainSchema)


module.exports = captainModel;