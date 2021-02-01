
require('dotenv').config();

const { json } = require('body-parser');
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
var user_detail_schema = require("./schema/user_detail");
var profile_schema = require("./schema/profile");
 



function connect_to_db() {
 let temp =    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });
 
}

async function fetch_remain( json_data) {
    // read all recived message from friends 

    // save message to your collection.chat_message 


    
    let result1;

 
    let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

   
    result1 = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
  

    if (result1 == null || result1.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    }





    let model1 = mongoose.models[json_data.u_id] === undefined ? mongoose.model(json_data.u_id, profile_schema) : mongoose.model(json_data.u_id);

    let  result2 = await model1.findOne({ friend_u_id: json_data.friend_u_id }, { chat_message:1 });

   
  if(!result2){
      return {status:"ok" ,data:[]}; 
  }
  if(!json_data.no){
    json_data.no=0; 
  }
 
    let start   =json_data.no-20>0?json_data.no-20:0; 
    let end = result2.chat_message.length>json_data.no?json_data.no:result2.chat_message.length; 
    let f_result = []; 





    for(let i=start; i<end; i++){
       f_result.push(result2.chat_message[i]); 

    }
 
    return { status: "ok", data:f_result,no:start};




}






async function main(data) {
    connect_to_db();
    let result;



    result = await fetch_remain(data);
    // mongoose.connection.close();
    return result;
}


module.exports = main;

