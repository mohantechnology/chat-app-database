
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

    //findOne user exist in user_detail

    let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

    // pr("Finding data is; ", { email: json_data.email, token: json_data.token, u_id: json_data.u_id });

    result1 = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    // pr("reslut of model 0 is: ", result1);


     


    if (result1 == null || result1.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    }



    let model1 = mongoose.models[json_data.u_id] === undefined ? mongoose.model(json_data.u_id, profile_schema) : mongoose.model(json_data.u_id);

   let  result = await model1.findOne({ friend_u_id: json_data.friend_u_id }, { recieved_message: 1,chat_message:1 });
    // result = JSON.stringify(result,null,4); 
    // pr("result of find is: ",result);

    //transfer recived message to your chat message in your collection 


  
    await model1.updateOne({ friend_u_id: json_data.friend_u_id }, { "$push": { chat_message: result.recieved_message } });
    await model1.updateOne({ friend_u_id: json_data.friend_u_id }, { "$set": { recieved_message: [] } });

   // transfer friend  send  message to  friend chat message in  friend's collection 
    let model2 = mongoose.models[json_data.friend_u_id] === undefined ? mongoose.model(json_data.friend_u_id, profile_schema) : mongoose.model(json_data.friend_u_id);

    let result_friend = await model2.findOne({ friend_u_id: json_data.u_id }, { sent_message: 1 })
    await model2.updateOne({ friend_u_id: json_data.u_id }, { "$push": { chat_message: result_friend.sent_message } });
    await model2.updateOne({ friend_u_id: json_data.u_id }, { "$set": { sent_message: [] } });


//     let r_len =result.recieved_message.length?20-result.recieved_message.length:0 ; 
//     let c_len = r_len<result.chat_message.length?r_len:result.chat_message.length;  
//     let f_result = []; 
//     pr("r_len ",r_len,"c_lne - ",c_len); 

// let mess_list  = JSON.parse(JSON.stringify(  result.chat_message ))

//     for(let i=result.chat_message.length-c_len; i<c_len; i++){
//        f_result.push(mess_list[i]); 

//     }
    
//     if(r_len!=20){

//         f_result.push({date:json_data.date,time:json_data.time,message:"unreaded message ("+r_len + ")" ,direction:"ser"}); 
//         for(let i=0; i<r_len; i++){
//             f_result.push(result.recieved_message[i]); 
//          }
    


//         }
     pr("final respose ",f_result)
    return { status: "ok", data:f_result };




}






async function main(data) {
    connect_to_db();
    let result;



    result = await fetch_friend(data);
    mongoose.connection.close();
    return result;
}

// mongoose.connection.on("open", function () {
//     pr(" ***coonected");
// })


// mongoose.connection.on("close", function () {
//     pr(" ***Discoonected");
// })
// mongoose.connection.on("error", function (error) {
//     pr(" ***error occured", error);
// })
// main({ email: "wonddte@vail.com  ", name: "     ", pass: "123456" });


// main({ name:"magic_masala" , friend_name:  "mad_max"}).then(data=>{
//  pr("result of main ",data); 
// });

// main({ name:"", friend_name:"mohan", message:"&&&&mandingo sends to mohan?" }); 
// main({ name:"mohan", friend_name:"mandingos", message:"&&mohan send to madingo ?" }) ;
module.exports = main;

