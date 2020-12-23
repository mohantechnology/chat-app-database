
// const { json } = require("express");

require('dotenv').config(); 
    const mongoose = require("mongoose");
    const validator = require("validator");
    let link = process.env.DB_LINK; 
    var json_data;
    var document;
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


    // setTimeout(() => {
    //    mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then((data) => {
    //     console.log("connectd succss!!");
    // }).catch(error => {
    //     if (error) {
    //         conn_err = error;
    //         // console.log(error); 
    //     }
    // }); 
    // }, 200);



    // const mongoose = require('mongoose');


    var user_detail_schema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        token_str: String,
        token_no: String,
        expire_time: String,
        account_status: String,
        current_status: String,
        profile_img: String,
    });


    var model = mongoose.model("user_detail", user_detail_schema);
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


    function trim_data() {
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
            return true;
        }

    }

    async function save_doc() {



        pr("save funcion called");
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



    // setTimeout(() => {
    //     mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });
    //     pr("settime out called"); 
    //     // pr("setfuncion claed')");
    //     model.find((error, data) => {
    //         if (!error) {
    //             console.log("--------------Start----------------------");
    //             console.log(data);
    //             model.estimatedDocumentCount((err, count) => {
    //                 console.log(err);
    //                 console.log(count);

    //                 mongoose.connection.close();
    //                 console.log("--------------END----------------------");
    //             });

    //         }
    //         else{
    //            pr("error occur in displaying data",error); 
    //         }


    //     });


    // }, 2000);



    async function main(data) {
        connect_to_db();
        let result;
        json_data = data; pr("json data is: ", json_data);
        result = trim_data(json_data); pr("trim data", result);


        if (!result) { mongoose.connection.close(); return "missing data" };


        result = is_validate_data(json_data); pr("valid data", result);

        if (result != true) { mongoose.connection.close(); return result; }


        document = new model(json_data);
        result = await save_doc();
        mongoose.connection.close();
        return result;


    }

// main({email:  "magic_masala@gmail.com ", name: "magic_masala", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}); 
// main({email:  "mad_max@gmail.com ", name: "mad_max", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}); 
// main({email:  "maggi@gmail.com ", name: "maggi", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}); 
module.exports = main;

