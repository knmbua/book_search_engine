import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// import schema from Book.js
import bookSchema from './schemas/Book.js';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    // set savedBooks to be an array of data that adheres to the bookSchema
    savedBooks: [bookSchema],
}, 
// set this to use virtual below
{
    toJSON: {
        virtuals: true,
    },
});
// hash user password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});
userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.virtual('bookCount').get(function () {
    return this.savedBooks.length;
});
const User = model('User', userSchema);
export default User;
