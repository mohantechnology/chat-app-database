
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



 

async function display_noti(json_data) {


    let result;
 

    //findOne user exist in user_detail

    let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

    
    result = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
     if (result == null || result.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    }

//read notification from user details and return 
 let  notification = JSON.parse( JSON.stringify(result.notification)); 

    return {status:"ok", data:notification} ;


}






async function main(data) {
    connect_to_db();
    let result;
    result = await display_noti(data);
    // mongoose.connection.close();
    return result;
}

module.exports = main;

