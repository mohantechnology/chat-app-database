
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

    if((!json_data)|| (!(json_data.email)) || (!json_data.password) ){
        return { status:"error" , message:"missing data "};
    }
    json_data.email =  json_data.email.trim();
    json_data.password = json_data.password.trim() 
    if(json_data.email=="" || json_data.password ==""){
        return { status:"error" , message:"missing data "};
    }
    else if (!validator.isEmail(json_data.email)) {
        return { status:"error" , message:"Enter  a valid email"};
    }
   
    
    return  json_data;
}



async function insert_new_password(json_data) {


    let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail",
    user_detail_schema) : mongoose.model("user_detail");
 
    var result;

    if (json_data.token_no) {
        result = await model.findOne({ email: json_data.email, token_no: json_data.token_no });
       
    } else if (json_data.token_str) {
        result = await model.findOne({ email: json_data.email, token_str: json_data.token_str });
        }
      if (result ) {
        
         if(result.expire_time <Date.now()){
            return {status:"error" , message:"Link Expired" } ;
         }

        let result2 = await model.updateOne({ email: json_data.email, token_str: json_data.token_str },{"$set":{token_str: crypto.randomBytes(25).toString('hex'),token_no:Math.round((Math.random() * 1000000)).toString(),password:json_data.password}});
        if(result2){
            return {status:"ok" , message:  "Successfully Update your Password"};
        }else{
            return {status:"error" , message:"Not updated Password" } ;
        }
         
     ;
        //
    }
    else {

        return {status:"error" , message:"Not updated Password" } ;
    }



}



async function main(data) {
    connect_to_db();
 
      let result  = is_validate_data(data); 
    if (result.status=="error") { return result; }



    result = await insert_new_password(result);
 
    return result;


}


module.exports = main;








