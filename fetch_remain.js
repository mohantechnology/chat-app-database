
require('dotenv').config();

const { json } = require('body-parser');
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
var user_detail_schema = require("./schema/user_detail");
var profile_schema = require("./schema/profile");


function pr(r1, r2, r3, r4) {

    if (r1) {
        console.log(r1)
    }

    if (r2) {
        console.log(r2)
    }
    if (r3) {
        console.log(r3)
    }
    if (r4) {
        console.log(r4)
    }
}




function connect_to_db() {
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

}

async function fetch_remain( json_data) {
    // read all recived message from friends 

    // save message to your collection.chat_message 


    
    let result1;


    pr("incoming data at fetch _profile ", json_data);

    let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

    // pr("Finding data is; ", { email: json_data.email, token: json_data.token, u_id: json_data.u_id });

    result1 = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    // pr("reslut of model 0 is: ", result1);

    //  find friend detail in user_detail 
   


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
//   pr("result 2 =",result2)
    let start   =json_data.no-20>0?json_data.no-20:0; 
    let end = result2.chat_message.length>json_data.no?json_data.no:result2.chat_message.length; 
    let f_result = []; 





    for(let i=start; i<end; i++){
       f_result.push(result2.chat_message[i]); 

    }
    
     pr("final respose ",); 
     pr("stat =  ",start,  " end = ",end ); 
    return { status: "ok", data:f_result,no:start};




}






async function main(data) {
    connect_to_db();
    let result;



    result = await fetch_remain(data);
    mongoose.connection.close();
    return result;
}


module.exports = main;

