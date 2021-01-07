
require('dotenv').config();
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
var user_detail_schema = require("./schema/user_detail");



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
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).catch(error => { });

}



async function check_user_detail(json_data) {

    let model1 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");
   
   let  result = await model1.findOne({ email: json_data.email, u_id:json_data.u_id,token :json_data.token});
//    pr("income dat ",json_data)
//    pr("reuls is: ",result); 

//update user as online 
    if (result) {
        let result2 = await model1.updateOne({ u_id:json_data.u_id,token :json_data.token}, {$set:{current_status:"online"}});
        return {  status: "ok" };
    }
    else {
        return { status: "error", message: "Invalid user" };
    }
}




// dt


async function main(data) {
    connect_to_db();
    let result= await check_user_detail(data);
    // mongoose.connection.close();
    return result;
}

module.exports = main;

