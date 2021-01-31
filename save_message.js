
require('dotenv').config(); 
// const { json } = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
let link = process.env.DB_LINK;
console.log("link is: ",link); 
var json_data;
var document;
var model;
var conn_err;

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

var profile_schema = new mongoose.Schema({

  

    friend_name: String,
    friend_email: String,
    chat_message: [] ,
    recieve_message:[],
    is_blocked:Boolean

});

function create_model() {
    model = mongoose.model(json_data.name,profile_schema); 

    model.findOne({friend_name:json_data.name},function (err,data) {
        if(err){
            pr("error occurs ",err); 
        }
        else{
            if(!data){
                document = new model ({friend_name : "admin",friend_email: "admin@gmail.com" ,recieve_message:["welcome to this chat app"]}); 
                document.save((err,doc)=>{
                    if(err){
                        pr("errori s: ",err); 
                    }
                    else{
                        pr("succes full  saved the first documetn " ); 
                    }
                }); 
            }
            else{
                pr("user already present "); 
            }
        }
    })
   
}
// pr("document is; ",document);
// document.save();  






async function save_message () {

    var result;
    pr("json_data is: ",json_data); 
//    var obj = {friend}
        

// pr("model is: ",model ); 
// document = new model({    
// name: json_data.sender_name,
// email: "m
// },
// chat_message: ["this is first saved message ","this is second saved message " ] ,
// recieve_message:["this is first recievced message "],

// }); 
    //  result = await document.save()
    //  pr("resul its; ",result); 
    result = await model.updateOne({friend_name:json_data.sender_name},{$push:{recieve_message:"this is message" }}); 
    //    pr("result is: ",result); 
 
}



async function main() {
    connect_to_db();
    let result;
    let data = { 
        name:"mohan",
        sender_name:"maggi",
        sender_email: "sender@gmail.com",
     reciver_email: "example22@gmail.com",
      sender_message: "this is sample message ",
      time:"10:20pm"
    }
    json_data = data; 
  create_model(); 
  await   save_message(); 

    // mongoose.connection.close();
    return result;



}
main(); 

