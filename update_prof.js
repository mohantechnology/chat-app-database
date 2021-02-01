
require('dotenv').config();
var crypto = require("crypto");
const mongoose = require("mongoose");
// const { path } = require('./schema/user_detail');
const path = require('path'); 
let link = process.env.DB_LINK;
// var json_data;
var user_detail_schema = require("./schema/user_detail");


function connect_to_db() {
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

}


async function update_profile(json_data) {


    let result;
    let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");
   result = await model.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    if (result == null || result.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    }

    let response = { data: [] };
    let result2; 
    
    if(json_data.is_file==1){
         let new_name ; 
        let file_ext = path.extname(json_data.file_name)
        while (true) {
            new_name = "pi" + crypto.randomBytes(10).toString('hex') + file_ext;
 
            result2  = await model.findOne({ profile_img:new_name });
            if (result2  == null) {
             break;
            }
        }
      result2=  await model.updateOne({u_id:json_data.u_id},{ $set:{profile_img:new_name ,pro_mess:json_data.pro_mess,account_type:json_data.account_type}});
      if(result2.nModified==1){
        return {status:"ok",curr_file_name: new_name ,prev_file_name:result.profile_img }
   
    }
    }else{
        //only save update message and accouunt type 
        result2=  await model.updateOne({u_id:json_data.u_id},{ $set:{pro_mess:json_data.pro_mess,account_type:json_data.account_type}});
        if(result2.nModified==1){
            return {status:"ok" }
       
        }
    }

 return {status:"ok",}

 

}






async function main(data) {
    connect_to_db();
    let result;
    result = await update_profile(data);
    // mongoose.connection.close();
    return result;
}

module.exports = main;











