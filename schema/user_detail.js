
    
    const mongoose = require("mongoose");
 
 module.exports = new  mongoose.Schema({
     u_id:String,
    name: String,
    email: String,
    password: String,
    token_str: String, // account activation string 
    token_no: String, // account activation number 
    token:String,          //temporary token given to user every time changed during login 
     p_id: String, //public id  used for sending friend request
    expire_time: String,
    account_status: String,
    current_status: String,
    account_type:String, //account type can be  public or private(not shown when other search for it )
    profile_img: String,
});