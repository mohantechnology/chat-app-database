
// const { json } = require("express");

require('dotenv').config();
const mongoose = require("mongoose");
const validator = require("validator");
var link = process.env.DB_LINK;
var crypto = require("crypto");
var user_detail_schema = require("./schema/user_detail");
// var profile_schema  =  require("./schema/profile");

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
        return { status:"error" , message:"Enter  a valid email"};
    }
    else if (json_data.name.length == 0) {
        return { status:"error" , message:"Enter   a valid name"};

    }
    else if (json_data.password.length < 6) {
        return { status:"error" , message:"Password  Must be Greater than or equal to 6 charcters"};
    
    }
    return  json_data;
}


function trim_data(json_data) {
    if (json_data.email && json_data.name && json_data.password && json_data.conform_password) {
        json_data.email = json_data.email.trim();
        json_data.name = json_data.name.trim();
        json_data.password = json_data.password.trim();
    } else {
        return { status:"error" , message:"All Fields are Required"};
    }
    if (json_data.email == "" || json_data.name == "" || json_data.password == "" ||   json_data.conform_password =="" ) {
        return { status:"error" , message:"All Fields are Required"};
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


  //total 50 random character starting with cz
            json_data.u_id = "cz"+  u_id;
            json_data.token_str = crypto.randomBytes(24).toString('hex');
            json_data.token_no = Math.round((Math.random() * 1000000)).toString();
            document = new model(json_data);
            pr("documetn is: ", document);
            result = await document.save();

            console.log("result of save is; ");


            return {status:"ok",message: "Acount Registered Successfully"}; 
        } catch (error) {

            return {status:"error",message: "something went wrong "}; 
        }

    }
    else {

        return {status:"ok",message: "Email already Exists"};
    }


}



async function main(data) {
    connect_to_db();
    let result;
  
    result = trim_data(data);


    if (result.status=="error" ) { mongoose.connection.close(); return {status:"error",message: "missing data" }};


    result = is_validate_data(data); pr("valid data", result);

    if (result.status=="error") { mongoose.connection.close(); return result; }



    result = await save_doc(result);
    //  pr( "model userd_deait", mongoose.models); 
    mongoose.connection.close();
    return result;


}


// main({ email: "mad_max@gmail.com ", name: "mad_max", password: "123456" }).then(data => {
//     pr("returned data  main is: ", data);

// }).catch(error => {
//     pr("error from main ", error);
// });

module.exports = main;

