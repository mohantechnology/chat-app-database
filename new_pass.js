
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



///***********make name or enter user name and original name  unique */

function connect_to_db() {
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

}


function is_validate_data(json_data) {

    if((!json_data)|| (!(json_data.email)) || (!json_data.new_pass) ){
        return { status:"error" , message:"missing data "};
    }
    json_data.email =  json_data.email.trim();
    json_data.new_pass = json_data.new_pass.trim() 
    if(json_data.email=="" || json_data.new_pass ==""){
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
    pr("active account  funcion called json data is: ",json_data);
    var result;

    if (json_data.token_no) {
        result = await model.findOne({ email: json_data.email, token_no: json_data.token_no });
        pr("number called ",result);

    } else if (json_data.token_str) {
        result = await model.findOne({ email: json_data.email, token_str: json_data.token_str });
        pr("string called ",result);
    }
    pr("result is: ",result); 
    if (result) {
        
        let result2 = await model.updateOne({ email: json_data.email, token_str: json_data.token_str },{"$set":{token_str: crypto.randomBytes(25).toString('hex'),token_no:Math.round((Math.random() * 1000000)).toString()}});
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








