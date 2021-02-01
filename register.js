
// const { json } = require("express");

require('dotenv').config();
const mongoose = require("mongoose");
const validator = require("validator");
var link = process.env.DB_LINK;
var crypto = require("crypto");
var user_detail_schema = require("./schema/user_detail");
const { json } = require('body-parser');


function connect_to_db() {
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

}


function is_validate_data(json_data) {
    if (!validator.isEmail(json_data.email)) {
        return { status:"error" , message:"Enter  a valid email"};
    }
    else if (! json_data.password ) {
        return { status:"error" , message:"Enter Your Password"};
    
    }
    else if (json_data.password.length < 6) {
        return { status:"error" , message:"Password  Must be Greater than or equal to 6 charcters"};
    
    }
    return  json_data;
}


function trim_data(json_data) {
    if (json_data.email  && json_data.password ) {
        json_data.email = json_data.email.trim();

        json_data.password = json_data.password.trim();
    } else {
        return { status:"error" , message:"All Fields are Required"};
    }
    if (json_data.email == "" ||  json_data.password == "" ) {
        return { status:"error" , message:"All Fields are Required"};
    } else {
        return json_data;
    }

}

async function save_doc(json_data) {

    let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail",
        user_detail_schema) : mongoose.model("user_detail");
 
    let result = await model.findOne({ email: json_data.email });
 
    if ( result == null) {
        //generate a random unique_id for collection name 
        let u_id; 
 
        while (true) {
            u_id = "cz"  + crypto.randomBytes(10).toString('hex');
              result = await model.findOne({ u_id: u_id }); 
            
            if (result == null) { 
                break;
            }
        } 
        //generate unique public id for send friend request 
        let  p_id ; 
        while (true) {
            p_id = "pz" + crypto.randomBytes(10).toString('hex');
         
        
            result = await model.findOne({ p_id:p_id }); 
            
            if (result == null) { 
                break;
            }
        }



        try {

  //total 50 random character starting with cz
            json_data.u_id =   u_id;
            json_data.p_id = p_id;
            json_data.token_str = crypto.randomBytes(24).toString('hex');
            json_data.token_no = Math.round((Math.random() * 1000000)).toString();

      //******** TODO remove this to unactivate */
        //    json_data.account_status = "active"; 
           json_data.account_type="public";
            document = new model(json_data); 
            result = await document.save(); 
            return {status:"ok",message: "Acount Registered Successfully", token_str:json_data.token_str, token_no: json_data.token_no,email: json_data.email}; 
        } catch (error) {

            return {status:"error",message: "something went wrong "}; 
        }

    }
    else {
        if(json_data.sign && json_data.sign=="resend"){
            return {status:"ok",message: "Resended Activation Link", token_str:result.token_str, token_no: result.token_no,email: result.email}; 
        }

        return {status:"error",message: "Email already Exists"};
    }


}



async function main(data) {
    connect_to_db();
    let result;
    result = trim_data(data);
   if (result.status=="error" ) { return {status:"error",message: "missing data" }};
 result = is_validate_data(data); 

    if (result.status=="error") {  return result; }
    result = await save_doc(result);
 
    return result;


}
 
module.exports = main;








