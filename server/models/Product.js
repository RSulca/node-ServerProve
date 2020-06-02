const { Schema, model } = require('mongoose')

let productSchema = new Schema({
    name: { type: String, required: [true, 'The name is necessary'] },
    priceUnit: { type: Number, required: [true, 'The price is necessary'] },
    description: { type: String, required: false },
    img: { type: String, required: false },
    stock: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const modelSchema = model('Productategory', productSchema);

module.exports = {
    modelSchema
}