
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

async function fetch_friend( json_data) {
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

    result2 = await model0.findOne({ u_id: json_data.friend_u_id  });
   


    let model1 = mongoose.models[json_data.u_id] === undefined ? mongoose.model(json_data.u_id, profile_schema) : mongoose.model(json_data.u_id);

   let  result = await model1.findOne({ friend_u_id: json_data.friend_u_id }, { recieved_message: 1,chat_message:1,sent_message:1 });
    // result = JSON.stringify(result,null,4); 
    // pr("result of find is: ",result);

    //transfer recived message to your chat message in your collection 


  if(result && result.recieved_message){



      await model1.updateOne({ friend_u_id: json_data.friend_u_id }, { "$push": { chat_message: result.recieved_message } });
      await model1.updateOne({ friend_u_id: json_data.friend_u_id }, { "$set": { recieved_message: [] } });

  }

   // transfer friend  send  message to  friend chat message in  friend's collection 
    let model2 = mongoose.models[json_data.friend_u_id] === undefined ? mongoose.model(json_data.friend_u_id, profile_schema) : mongoose.model(json_data.friend_u_id);

    let result_friend = await model2.findOne({ friend_u_id: json_data.u_id }, { sent_message: 1 })
    if(result_friend && result_friend.sent_message){
    await model2.updateOne({ friend_u_id: json_data.u_id }, { "$push": { chat_message: result_friend.sent_message } });
    await model2.updateOne({ friend_u_id: json_data.u_id }, { "$set": { sent_message: [] } });
    }
  if(!result){
      return {status:"ok" ,data:[],no:0}; 
  }


 pr(result.recieved_message)
      //check if user hass seen this recieved message **
    // let unreaded_rec_len =0 ;
    // console.log("going to loop  at a= ",unreaded_rec_len); 
    // for(let i =result.recieved_message.length-1; i>=0; i-- ){

    //     console.log("inside  fromloo p   at a= ",unreaded_rec_len ,result.recieved_message[i].is_readed==false, " is readed  = ", result.recieved_message[i].is_readed);
    //     if(result.recieved_message[i].is_readed==false){
    //         unreaded_rec_len = i+1; 
    //         console.log("breaking at a= ",unreaded_rec_len); 
    //         break; 
    //     }
    // }  

//     console.log("comming fromloo p   at a= ",unreaded_rec_len);
//     let r_len =unreaded_rec_len?20-unreaded_rec_len:20; 
//   let c_len = result.chat_message.length>r_len?r_len:result.chat_message.length

    // let r_len =20-result.recieved_message.length; 
    

  let c_len = result.chat_message.length<20 ? 0: result.chat_message.length-20 ;
let c_end_len  = json_data.len ?result.chat_message.length- json_data.len:result.chat_message.length;
    let f_result = []; 

    for(let i=c_len; i<c_end_len; i++){
       f_result.push(result.chat_message[i]); 
    }
    
    if(result.recieved_message.length >0 ){

        f_result.push({date:json_data.date,time:json_data.time,message:"unreaded message ("+result.recieved_message.length + ")" ,direction:"ser"}); 
        for(let i=0; i<result.recieved_message.length; i++){
            f_result.push(result.recieved_message[i]); 
         }
    


        }

           for(let i=0; i<result.sent_message.length; i++){
            f_result.push(result.sent_message[i]); 
         } 
        
        
    
    //  pr("final respose ",); 
    //  pr("r_len ",r_len); 
    return { status: "ok", data:f_result,name:result2.name,current_status:result2.current_status,img:result2.img,no:c_len};




}






async function main(data) {
    connect_to_db();
    let result;



    result = await fetch_friend(data);
    // mongoose.connection.close();
    return result;
}
module.exports = main;

