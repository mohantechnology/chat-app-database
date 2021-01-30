
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

    // pr("save funcion called json data is: ", json_data);
    let result = await model.findOne({ email: json_data.email },{u_id:1,expire_time:1});

    // console.log("find result is  : ");
    console.log(result);


 
    if ( result) {

       //return if prev  email sended time is  less than 1 min  ; 
     //###
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
    //  pr( "model userd_deait", mongoose.models); 
    // mongoose.connection.close();
    return result;


}

// json_data.email && json_data.name && json_data.password && json_data.conform_password
// main({ email: "momo@gmail.com ", name: "momo", password: "123456",
// conform_password: "123456",account_type:"private" }).then(data => {
//     pr("returned data  main is: ", data);

// }).catch(error => {
//     pr("error from main ", error);
// });

module.exports = main;








