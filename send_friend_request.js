
require('dotenv').config();

const { json } = require('body-parser');
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
var user_detail_schema =  require("./schema/user_detail");
var profile_schema  =  require("./schema/profile");


function connect_to_db() {
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

}


async function send_friend_request(json_data) {
   

    let result ; 
 

      let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");
 
    result = await   model0.findOne({email: json_data.email,token:json_data.token,u_id:json_data.u_id});
      if(result==null|| result.account_status !="active"){
          return {status:"error",message:"Not a valid user"}
      }


    let len = result.sended_request.length;
    for (let i = 0; i < len; i++) {
        if (result.sended_request[i].sended_id==json_data.friend_p_id) {
            return { status: "error", message: "Request Already Sended" }
        }

    } 
let result1 =    await   model0.updateOne({p_id:result.p_id},{$push:{sended_request:{sended_id:json_data.friend_p_id}}});
 
if(result1.nModified==0){
    return {status: "error", message:"Not able to send request"};

}






// find and send request ot user  with matching  p_id

let friend_result =  await   model0.updateOne({p_id:json_data.friend_p_id},{$push:{friend_request:{ 
    sender_name:result.name,
    sender_pro_mess:result.pro_mess,
    sender_img : result.profile_img,
    sender_p_id:result.p_id,
    data:json_data.date,
    time:json_data.time
 }}});
 
if(friend_result.nModified==1){
    return {status:"ok" }; 
}else{
    return {status: "error", message:"Not able to send request"}; 
}
 
    
}






async function main(data) {
 
    connect_to_db();
    let result;
    result = await send_friend_request(data);
    // mongoose.connection.close();
    return result;
}

module.exports = main;

