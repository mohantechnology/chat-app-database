
// const { json } = require("express");

require('dotenv').config();
const mongoose = require("mongoose");
const validator = require("validator");
let link = process.env.DB_LINK;
var crypto = require("crypto");
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



///***********make name or enter user name and original name  unique */

function connect_to_db() {
    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

}


function is_validate_data(json_data) {
    if (!validator.isEmail(json_data.email)) {
        return "Enter   a valid email";
    }
    else if (json_data.name.length == 0) {
        return "Enter   a valid name";
    }
    else if (json_data.pass.length < 6) {
        return "Password Must be Greater than 6 charcters";
    }
    return true;
}


function trim_data(json_data) {
    if (json_data.email && json_data.name && json_data.pass) {
        json_data.email = json_data.email.trim();
        json_data.name = json_data.name.trim();
        json_data.pass = json_data.pass.trim();
    } else {
        return false;
    }
    if (json_data.email == "" || json_data.name == "" || json_data.pass == "") {
        return false;
    } else {
        return json_data;
    }

}

async function save_doc(json_data) {

    let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail",
        user_detail_schema) : mongoose.model("user_detail");

    // pr("save funcion called json data is: ", json_data);
    let result = await model.findOne({ email: json_data.email });

    // console.log("find result is  : ");
    console.log(result);
    if (result == null) {
        //generate a random unique_id for collection name 
        let u_id; 
        // let count=2; 
        while (true) {
            u_id = crypto.randomBytes(10).toString('hex');
            // u_id = "thisifsnotuni";
        
            result = await model.findOne({ u_id: u_id });
            // pr("----- result  of  ith iteration is is: -> ", result);
            
            if (result == null) {
                pr("breaking ")
                break;
            }
        }


        try {



            json_data.u_id = u_id;
            json_data.token_str = crypto.randomBytes(25).toString('hex');
            json_data.token_no = Math.round((Math.random() * 1000000)).toString();
            document = new model(json_data);
            pr("documetn is: ", document);
            result = await document.save();

            console.log("result of save is; ");


            return "success";
        } catch (error) {

            console.log((error))
        }

    }
    else {

        return "Email already Exists";
    }


}



async function main(data) {
    connect_to_db();
    let result;
    json_data = data;
    result = trim_data(json_data);


    if (!result) { mongoose.connection.close(); return "missing data" };


    result = is_validate_data(json_data); pr("valid data", result);

    if (result != true) { mongoose.connection.close(); return result; }



    result = await save_doc(json_data);
    mongoose.connection.close();
    return result;


}


main({ email: "yrerar@gmgail.com ", name: "road", pass: "1re3456" }).then(data => {
    pr("returned data  main is: ", data);

}).catch(error => {
    pr("error from main ", error);
});

// main({email:  "magic_masala@gmail.com ", name: "magic_masala", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}); 
// main({email:  "mad_max@gmail.com ", name: "mad_max", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}); 
// main({email:  "maggi@gmail.com ", name: "maggi", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}); 
module.exports = main;

