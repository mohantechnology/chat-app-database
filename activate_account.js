
    require('dotenv').config(); 
    const { json } = require("body-parser");
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
    var json_data;
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


    // var user_detail_schema = new mongoose.Schema({
    //     name: String,
    //     email: String,
    //     password: String,
    //     token_str: String,
    //     token_no: String,
    //     expire_time: String,
    //     account_status: String,
    //     current_status: String,
    //     profile_img: String,
    // });


    var model = mongoose.model("user_detail");
     
    function connect_to_db() {
        mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

    }




    function validate_and_trim_data() {
        if (json_data && json_data.email) {
            json_data.email = json_data.email.trim();


        } else {
            return false;
        }

        if (json_data.token_no) {
            json_data.token_no = json_data.token_no.trim();
            return true;
        }
        else if (json_data.token_str) {
            json_data.token_str = json_data.token_str.trim();
            return true;
        }
        else {
            // pr("reutrn flase"); 
            return false;
        }

    }

    async  function  create_new_collection(){

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

    }

    async function activate_account() {
        //if acitivate method is token  number check number else check token string 

        pr("active account  funcion called");
        var result;
        if (json_data.token_no) {
            result = await model.findOne({ email: json_data.email, token_no: json_data.token_no });
            pr("no called ");

        } else if (json_data.token_str) {
            result = await model.findOne({ email: json_data.email, token_str: json_data.token_str });
            pr("string called ");
        }
        pr("result is: ",result); 
        if (result) {

            try {
                pr("updating to active");
                var temp_data = await model.updateOne({ _id: result._id }, { account_status: "active" });
                pr("temp_data= ", temp_data);

                 await create_new_collection();  
                return "Account is Activated Successfully";


            } catch (error) {
                return "something went wrong";
            }


            //
        }
        else {

            return "Account Not Registered";
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
    //         else {
    //             pr("error occur in displaying data", error);
    //         }


    //     });


    // }, 2000);



    async function main(data) {
        connect_to_db();
        let result;
        json_data = data; pr("json data is: ", json_data);
        result = validate_and_trim_data(json_data);
        if (!result) {
            mongoose.connection.close();
            return "missing data"
        };
        result = await activate_account();
        mongoose.connection.close();
        return result;
    }

    // mongoose.connection.on("open", function () {
    //     pr(" ***coonected");
    // })

    // mongoose.connection.on("close", function () {
    //     pr(" ***Discoonected");
    // })
    // mongoose.connection.on("error", function (error) {
    //     pr(" ***error occured", error);
    // })
    // main({ email: "wonddte@vail.com  ", name: "     ", pass: "123456" });



module.exports = main;

