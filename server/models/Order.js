const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const OrderSchema = new Schema({
    username: {type:String, required:true},
    products: {type:[Schema.Types.ObjectId], ref:'Product', required:true},
    productNames: {type:[String],},
    quantities: {type:[Number], required:true},
    prices: {type:[Number], required:true},
    desc: String,
    date: {type:Date, required:true},
    mark: Boolean,
});

const OrderModel = model('Order', OrderSchema);

module.exports = OrderModel;