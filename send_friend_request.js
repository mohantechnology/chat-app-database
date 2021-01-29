
require('dotenv').config();

const { json } = require('body-parser');
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
// var json_data;
var user_detail_schema =  require("./schema/user_detail");
var profile_schema  =  require("./schema/profile");
// var model;
// var document;
// var conn_err;

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













async function send_friend_request(json_data) {
   

    let result ; 
      pr("incoming data at fetch _profile ",json_data); 
   
      //findOne user exist in user_detail

      let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");
          
      pr("Finding data is; ",{email: json_data.email,token:json_data.token,u_id:json_data.u_id});
    //   result = await   model0.findOne({email: json_data.email, u_id:json_data.u_id,token:json_data.token});
    result = await   model0.findOne({email: json_data.email,token:json_data.token,u_id:json_data.u_id});
      pr("reslut of model 0 is: ", result); 
      if(result==null|| result.account_status !="active"){
          return {status:"error",message:"Not a valid user"}
      }


    let len = result.sended_request.length;
    for (let i = 0; i < len; i++) {
        if (result.sended_request[i].sended_id==json_data.friend_p_id) {
            return { status: "error", message: "Request Already Sended" }
        }

    }

//  push sended request  to sended_request[]  in sender document 
// let obj = {}; 
// obj[json_data.friend_p_id] = true; 
let result1 =    await   model0.updateOne({p_id:result.p_id},{$push:{sended_request:{sended_id:json_data.friend_p_id}}});
// pr("result of push sended request :)-> ",result1); 


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
 pr("frind res",friend_result); 




if(friend_result.nModified==1){
    return {status:"ok" }; 
}else{
    return {status: "error", message:"Not able to send request"}; 
}



    
}






async function main(data) {

    pr("inc********data at send request : ",data); 
    connect_to_db();
    let result;
    result = await send_friend_request(data);
    mongoose.connection.close();
    return result;
}


// main({ email: "mad_max@gmail.com", name: "mad_max", password: "123456" ,u_id:"czf96c5e50d312d5309048" }).then(data => {
//     pr("returned data  main is: ", data);

// }).catch(error => {
//     pr("error from main ", error);
// });
module.exports = main;

