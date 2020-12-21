
require('dotenv').config(); 
// const { json } = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
let link = process.env.DB_LINK;
console.log("link is: ",link); 
var json_data;
var document;
var model;
var conn_err;

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

var profile_schema = new mongoose.Schema({

    self_profile: {
        name: String,
        email: String,
        status: String,
        img_path: String
    },
   friend:{
    name: String,
    email: String
   },
    chat_message: [] ,
    recieve_message:[],
    is_blocked:Boolean

});

function create_model() {
    model = mongoose.model(json_data.email,profile_schema); 
    
}



function is_validate_data(json_data) {
    if (!validator.isEmail(json_data.email)) {
        return "Enter   a valid email";
    }

    else if (json_data.pass.length < 6) {
        return "Password Must be Greater than 6 charcters";
    }
    return true;
}


function trim_data() {
    if (json_data.email  && json_data.pass) {
        json_data.email = json_data.email.trim();
     
        json_data.pass = json_data.pass.trim();
    } else {
        return false;
    }
    if (json_data.email == ""  || json_data.pass == "") {
        return false;
    } else {
        return true;
    }

}

async function fetch_profile_data () {

    var result;
    result = await model.findOne({ email: json_data.email });

    console.log("find result is  : ");
    console.log(result);
    if (result == null) {
        try {
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
    result = is_validate_data(json_data); 
    if (result != true) { mongoose.connection.close(); return result; }


    document = new model(json_data);
    result = await fetch_profile_data();
    mongoose.connection.close();
    return result;



}

// mongoose.connection.on("open", function () {
//     pr(" ***coonected->save_email");
// })

// mongoose.connection.on("close", function () {
//     pr(" ***Discoonected");
// })
// mongoose.connection.on("error", function (error) {
//     pr(" ***error occured", error);
// })
// // main({ email: "wonddte@vail.com  ", name: "     ", pass: "123456" });
// module.exports = main;



// // console.log(!validator.isEmail("wondvgail.com" ))

