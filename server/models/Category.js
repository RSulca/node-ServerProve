const { Schema, model } = require('mongoose');

let categorySchema = new Schema({
    description: { type: String, unique: true, required: [true, 'La description is necessary'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const modelSchema = model('Category', categorySchema);

module.exports = {
    modelSchema
}    