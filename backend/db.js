const mongoose = require('mongoose');

const connectionURL = `mongodb+srv://admin:XbrsP58b96ovZP55@cluster0.8r4dity.mongodb.net/paytm_clone`;
mongoose.connect(connectionURL);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
});
const User = mongoose.model('User', userSchema);

export { User }