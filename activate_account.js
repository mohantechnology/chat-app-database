
    require('dotenv').config(); 
    const { json } = require("body-parser");
    const mongoose = require("mongoose");
    var link = process.env.DB_LINK; 
    var user_detail_schema = require("./schema/user_detail");
    var profile_schema  =  require("./schema/profile");


    function connect_to_db() {
        mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

    }
    async function activate_account(json_data) {
        //if acitivate method is token  number check number else check token string 


        let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail",
        user_detail_schema) : mongoose.model("user_detail");
     
        var result;

        if (json_data.token_no) {
            result = await model.findOne({ email: json_data.email, token_no: json_data.token_no });
           

        } else if (json_data.token_str) {
            result = await model.findOne({ email: json_data.email, token_str: json_data.token_str });
           
        }
 
        if (result) {

            try {
 
                var temp_data = await model.updateOne({ _id: result._id }, { account_status: "active" });
         
     
         return {status:"ok" , message:  "Account is Activated Successfully"};
            } catch (error) {
                return {status:"error" , message:"something went wrong" } ;
            }
 
        }
        else {

            return {status:"error" , message:"Account Not Registered" } ;
        }



    }


    async function main(data) {
        connect_to_db();
        let result;

 
        result = await activate_account(data);
        // mongoose.connection.close();
        return result;
    }

   
    module.exports = main;

