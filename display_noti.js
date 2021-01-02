
require('dotenv').config();

const { json } = require('body-parser');
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
// var json_data;
var user_detail_schema = require("./schema/user_detail");
var profile_schema = require("./schema/profile");
const { response } = require('express');
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













async function display_noti(json_data) {


    let result;


    pr("incoming data at fetch _profile ", json_data);

    //findOne user exist in user_detail

    let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

    // pr("Finding data is; ", { email: json_data.email, token: json_data.token, u_id: json_data.u_id });

    result = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    pr("reslut of model 0 is: ", result);


     


    if (result == null || result.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    }

//read notification from user details and return 
 let  notification = JSON.parse( JSON.stringify(result.notification)); 
  pr("notifcaiton is; ",notification)
    return {status:"ok", data:notification} ;


}






async function main(data) {
    connect_to_db();
    let result;
    result = await display_noti(data);
    mongoose.connection.close();
    return result;
}


// main({ email: "mad_max@gmail.com", name: "mad_max", password: "123456", u_id: "czf96c5e50d312d5309048" , search_value:"m" }).then(data => {
//     pr("returned data  main is: ", data);

// }).catch(error => {
//     pr("error from main ", error);
// });
module.exports = main;

