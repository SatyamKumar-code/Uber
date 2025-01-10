const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            require: true,
            minlength: [ 3, 'First name must be at leaast 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at leaast 3 characters long'],
        }
    },
    email:{
        type: String,
        require: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);


module.exports = userModel;