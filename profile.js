
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













async function fetch_profile_data(json_data) {
   

    let result ; 
      pr("incoming data at fetch _profile ",json_data); 
   
      //findOne user exist in user_detail

      let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

      result = await   model0.findOne({email: json_data.email,u_id:json_data.u_id,password:json_data.password});
      pr("reslut of model 0 is: ", result); 
      if(result==null|| result.account_status !="active"){
          return {status:"error",message:"Not a valid user"}
      }
    //   await   model0.updateOne({email: json_data.email,u_id:json_data.u_id});
    //  #todo 
    // read all recived message from friends 

    // save message to your collection.chat_message 
 



    let model1 = mongoose.models[json_data.u_id] === undefined ? mongoose.model(json_data.u_id, profile_schema) : mongoose.model(json_data.name);

  
    


    result = await  model1.findOne({},{name:1,friend_name:1,_id:0,recieved_message:1,u_id:1 }) ; 
    if(result){
           pr("result of findOne is: ",result); 
    let i,len= result.length; 
    let response = {data : []};
    
    for(let i =0; i<len; i++ ){
    //    console.log(result[i].friend_name, " send you ",result[i].recieved_message.length); 
    response.data.push( { name: result[i].friend_name , count: result[i].recieved_message.length, img: "racoon.jpg" ,u_id:result[i].u_id});
     
    // response.count = 
    }

   //#todo
    response.status="ok"; 

    return  response; 
    }else{

        return {status:"ok",data:[]} ;
    }
    // result = JSON.stringify(result,null,4); 
 
    
}






async function main(data) {
    connect_to_db();
    let result;
    result = await fetch_profile_data(data);
    mongoose.connection.close();
    return result;
}


// main({ email: "mad_max@gmail.com", name: "mad_max", password: "123456" ,u_id:"czf96c5e50d312d5309048" }).then(data => {
//     pr("returned data  main is: ", data);

// }).catch(error => {
//     pr("error from main ", error);
// });
module.exports = main;

