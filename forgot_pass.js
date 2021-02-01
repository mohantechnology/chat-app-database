
// const { json } = require("express");

require('dotenv').config();
const mongoose = require("mongoose");
const validator = require("validator");
var link = process.env.DB_LINK;
var crypto = require("crypto");
var user_detail_schema = require("./schema/user_detail");
const { json } = require('body-parser');
const { join } = require('path');
// var profile_schema  =  require("./schema/profile");

 



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



async function create_token(json_data) {

    let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail",
        user_detail_schema) : mongoose.model("user_detail");

 
    let result = await model.findOne({ email: json_data.email },{u_id:1,expire_time:1});

 

 
    if ( result) {


         if(false &&  result.expire_time-600000 +60000 > Date.now()){
            return {status:"error",message: "Reset Password  link already sent to your Email"};
         }
        let token_string = crypto.randomBytes(25).toString('hex'); 
        let token_num =  Math.round((Math.random() * 1000000)).toString();


         let    result2 = await model.updateOne({ u_id: result.u_id , email: json_data.email},{token_str:token_string,token_no:token_num,expire_time:Date.now() +     600000});

     
            if(result2.nModified== 1){
                return  {status:"ok", token_str: token_string,email:json_data.email,token_no:token_num }
            }else{
                return {status:"error",message: "token not created"};
            }
      
    }
    else {

        return {status:"error",message: "Email Not Found"};
    }


}



async function main(data) {
    connect_to_db();
    let result= is_validate_data(data)

    if (result.status=="error") { return result; }



    result = await create_token(result);
 
    return result;


}



module.exports = main;








