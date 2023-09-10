const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ProductSchema = new Schema({
    name: {type:String, required:true, unique: true},
    desc: String,
    imgSrc: String,
    price: {type:Number, required:true}, //in euro
    hidden: Boolean
});

const ProductModel = model('Product', ProductSchema);

module.exports = ProductModel;