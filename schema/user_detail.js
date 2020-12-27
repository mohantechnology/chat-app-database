
    
    const mongoose = require("mongoose");
 
 module.exports = new  mongoose.Schema({
     u_id:String,
    name: String,
    email: String,
    password: String,
    token_str: String,
    token_no: String,
    expire_time: String,
    account_status: String,
    current_status: String,
    profile_img: String,
});