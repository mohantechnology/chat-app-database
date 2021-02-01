




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




async function transfer_file(json_data) {


    let result;
     let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

    result = await model.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id }); 
    if (result == null || result.account_status != "active") {
        return { status: "error", message: "Not a valid user" }
    } 
    let result2;
  let    folder_name; 
  let file_ext = path.extname(json_data.file_name); 
    if (!result.folder_name) {
 let new_folder_name ; 
        while (true) {
            new_folder_name = "fi" + crypto.randomBytes(10).toString('hex');

            //
            result2 = await model.findOne({ folder_name: new_folder_name }); 
            if (result2 == null) { 
                break;
            
            }
        }
        result2 = await model.updateOne({ u_id: json_data.u_id }, { $set: { folder_name: new_folder_name } });
        folder_name = new_folder_name; 
    }else{
        folder_name = result.folder_name;   
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
            break;
        }
    }
    
    result2 = await model.updateOne({ u_id: json_data.u_id }, { $push: { files: { file_name: json_data.file_name,new_file_name: new_file_name,sender_u_id: json_data.u_id,rec_u_id : json_data.curr_f_id,mime_type: json_data.mime_type } } });
    if (result2.nModified == 1) {
        return { status: "ok", file_name: json_data.file_name, curr_file_name: new_file_name,folder_name:folder_name  }

    } else {

        return { status: "error", message: "not able to save file_name" };

    }


}






async function main(data) {
    connect_to_db();
    let result;
    result = await transfer_file(data);
    return result;
}

module.exports = main;
