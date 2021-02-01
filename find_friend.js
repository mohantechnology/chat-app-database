
require('dotenv').config();

const { json } = require('body-parser');
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
// var json_data;
var user_detail_schema = require("./schema/user_detail");
var profile_schema = require("./schema/profile");
const { response } = require('express');


function connect_to_db() {
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

}


async function fetch_friend_list(json_data) {


    let result;
    let table = {}; //do not again send the request to them  
    let table_friend = {}; //those who are already in friend list  

 
    //findOne user exist in user_detail

    let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");
 
    result = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
 
    if (result == null || result.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    }
    if (json_data.search_value == null || json_data.search_value == undefined || json_data.search_value == "") {
        return { status: "error", message: "serching keywords required" }
    }

 //those whom  request are already sended  add them in  table 
 let  sended_request = JSON.parse( JSON.stringify(result.sended_request)); 
 
 for(let i=0; i<sended_request.length; i++){
        table[sended_request[i].sended_id] =true; 
 }
 
//already friends
 let  friend_list = JSON.parse( JSON.stringify(result.friend_list)); 
 
 for(let i=0; i<friend_list.length; i++){
    table_friend[friend_list[i].sender_p_id] =true; 
 }
 
 
    // > db.test.find( { sku: { $regex: /dz/,"$options":"" } } );
    let search_exp = RegExp(json_data.search_value, "i");
    // pr("regex parrten is: ',", search_exp);
    result = await model0.find({ $and: [{ name: { $regex: search_exp } }, { account_type: "public" }] } ,{_id:0,name:1,p_id:1,profile_img:1,pro_mess:1});
 
     result = JSON.parse( JSON.stringify(result)); 
     let response = []; 
 
    for(let i=0; i<result.length; i++){

        if(result[i].p_id!= json_data.p_id){
            if( table[result[i].p_id]){
                result[i].p_id=0; //request already sended 
              

            }
            else if(table_friend[result[i].p_id]){
                continue;   //those who are friend not include them 
            }
        //         result[i]["img"]="racoon.jpg"; 
        // result[i]["pro_mess"]="Hello there I am using this Chat app"; 
        response.push(result[i])
        }
    
    }
 
    return {status:"ok",list:response} ;


}






async function main(data) {
    connect_to_db();
    let result;
    result = await fetch_friend_list(data);
    // mongoose.connection.close();
    return result;
}


module.exports = main;

