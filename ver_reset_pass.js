
// const { json } = require("express");

require('dotenv').config();
const mongoose = require("mongoose");
const validator = require("validator");
var link = process.env.DB_LINK;
var crypto = require("crypto");
var user_detail_schema = require("./schema/user_detail");
const { json } = require('body-parser');
const { join } = require('path'); 
function connect_to_db() {
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

}


function is_validate_data(json_data) {

    if((!json_data)|| (!(json_data.email))  ){
        return { status:"error" , message:"missing data "};
    }
    json_data.email =  json_data.email.trim(); 
    if(json_data.email==""){
        return { status:"error" , message:"missing data "};
    }
    else if (!validator.isEmail(json_data.email)) {
        return { status:"error" , message:"Enter  a valid email"};
    }
   
    
    return  json_data;
}



async function verify_reset_pass_token(json_data) {


    let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail",
    user_detail_schema) : mongoose.model("user_detail"); 
    var result;

    if (json_data.token_no) {
        json_data.token_no=json_data.token_no.trim(); 
        result = await model.findOne({ email: json_data.email, token_no: json_data.token_no });

    } else if (json_data.token_str) {
        result = await model.findOne({ email: json_data.email, token_str: json_data.token_str });
    }
    if (result) {
          
        if(result.expire_time <Date.now()){
            return {status:"error" , message:"Link Expired" } ;
         }
     return {status:"ok" , message:  "verfied email successfully",token_no: result.token_no,token_str:result.token_str,email:result.email};
        //
    }
    else {

        return {status:"error" , message:"Verfication Failed" } ;
    }



}



async function main(data) {
    connect_to_db();
  let   result = await verify_reset_pass_token(data);
    return result;
 
}

module.exports = main;








