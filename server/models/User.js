const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValid = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} is not a role valid'
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is necessary']
    },
    password: {
        type: String,
        required: [true, 'The password is necessary']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValid
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(uniqueValidator, {message: '{PATH} should be unique' })

const modelSchema = model('User', userSchema);

module.exports = {
    modelSchema
}       