const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const NotificationSchema = new Schema({
    dest: {type:String, required:true},
    title: String,
    content: {type:String, required:true},
    date: {type:Date, required:true},
    read: Boolean,
});

const NotificationModel = model('Notification', NotificationSchema);

module.exports = NotificationModel;