




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




async function transfer_file(json_data) {


    let result;
    pr("incoming data at fetch _profile ", json_data);


    let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

    // pr("Finding data is; ", { email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    //   result = await   model.findOne({email: json_data.email, u_id:json_data.u_id,token:json_data.token});
    result = await model.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    // pr("reslut of model 0 is: ", result);
    if (result == null || result.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    }
    //   await   model.updateOne({email: json_data.email,u_id:json_data.u_id});
    //  #todo 



    let result2;
  let    folder_name; 
  let file_ext = path.extname(json_data.file_name);
    //create folder name; 
    if (!result.folder_name) {
 let new_folder_name ; 
        while (true) {
            new_folder_name = "fi" + crypto.randomBytes(10).toString('hex') + file_ext;

            //
            result2 = await model.findOne({ folder_name: new_folder_name });
            // pr("----- result2   of  ith iteration is is: -> ", result2 );
            //check if filename already exists 
            if (result2 == null) {
                pr("breaking ")
                break;
            
            }
        }
        result2 = await model.updateOne({ u_id: json_data.u_id }, { $set: { folder_name: new_folder_name } });
        folder_name = new_folder_name; 
    }else{
        folder_name = result.folder_name; 
        pr("****not creatig new foldername "); 
    }
    //create new file name 

    let new_file_name;
    // let total_file_count = 

    let table_file = {};
    for (let i = 0; i < result.files.length; i++) {
        table_file[result.files[i].file_name] = true;
    }
    while (true) {
        new_file_name = "fi" + crypto.randomBytes(10).toString('hex') + file_ext;
        if (table_file[new_file_name] == null) {
            // pr("breaking ")
            break;
        }
    }
    
    // pr("table file ",table_file); 
    pr("new namw= " + new_file_name)
    result2 = await model.updateOne({ u_id: json_data.u_id }, { $push: { files: { file_name: json_data.file_name,new_file_name: new_file_name,sender_u_id: json_data.u_id,rec_u_id : json_data.curr_f_id } } });
    if (result2.nModified == 1) {
        return { status: "ok", file_name: json_data.file_name, curr_file_name: new_file_name,folder_name:folder_name }

    } else {

        return { status: "error", message: "not able to save file_name" };

    }


}






async function main(data) {
    connect_to_db();
    let result;
    result = await transfer_file(data);
    // mongoose.connection.close();
    pr("result respnonse is: ",result); 
    return result;
}

module.exports = main;
