
    
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
    expire_time: Number,
   
    account_status: String,   //account is active or not 
    current_status: String,// currently online or not 
    account_type:String, //account type can be  public or private(not shown when other search for it )
    profile_img: String,
    pro_mess :String,
    friend_request:[] ,//All recieved request are stored in this array 
    sended_request:[], // All seneded request are stroed in this array
    friend_list:[],  // All those who accepted request
    notification:[],
    files:[],
       
    folder_name:String, 
});