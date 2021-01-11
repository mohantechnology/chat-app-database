
require('dotenv').config();
var crypto = require("crypto");
const mongoose = require("mongoose");
// const { path } = require('./schema/user_detail');
const path = require('path'); 
let link = process.env.DB_LINK;
// var json_data;
var user_detail_schema = require("./schema/user_detail");
// var profile_schema = require("./schema/profile");
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










async function update_profile(json_data) {


    let result;
    pr("incoming data at fetch _profile ", json_data);


    let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

    // pr("Finding data is; ", { email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    //   result = await   model0.findOne({email: json_data.email, u_id:json_data.u_id,token:json_data.token});
    result = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    // pr("reslut of model 0 is: ", result);
    if (result == null || result.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    }
    //   await   model0.updateOne({email: json_data.email,u_id:json_data.u_id});
    //  #todo 



     
    let response = { data: [] };
    let result2; 
    
    if(json_data.is_file==1){
         let new_name ; 
        let file_ext = path.extname(json_data.file_name)
        while (true) {
            new_name =  + crypto.randomBytes(10).toString('hex') + file_ext;
         
        
            result2  = await model.findOne({ profile_img:new_name });
            // pr("----- result2   of  ith iteration is is: -> ", result2 );
            
            if (result2  == null) {
                pr("breaking ")
                break;
            }
        }
      result2=  await model.updateOne({u_id:json_data.u_id},{ $set:{profile_img:new_name ,pro_mess:json_data.prof_mess,account_type:json_data.account_type}});
    }else{
        result2=  await model.updateOne({u_id:json_data.u_id},{ $set:{pro_mess:json_data.prof_mess,account_type:json_data.account_type}});
    }
 pr("result2 = ",result2); 
 return {status:"ok",}










}






async function main(data) {
    connect_to_db();
    let result;
    result = await update_profile(data);
    mongoose.connection.close();
    return result;
}
s = main;











