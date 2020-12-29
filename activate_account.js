
    require('dotenv').config(); 
    const { json } = require("body-parser");
    const mongoose = require("mongoose");
    var link = process.env.DB_LINK; 
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


     
    function connect_to_db() {
        mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

    }




    async function activate_account(json_data) {
        //if acitivate method is token  number check number else check token string 


        let model = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail",
        user_detail_schema) : mongoose.model("user_detail");
        pr("active account  funcion called json data is: ",json_data);
        var result;

        if (json_data.token_no) {
            result = await model.findOne({ email: json_data.email, token_no: json_data.token_no });
            pr("number called ",result);

        } else if (json_data.token_str) {
            result = await model.findOne({ email: json_data.email, token_str: json_data.token_str });
            pr("string called ",result);
        }
        pr("result is: ",result); 
        if (result) {

            try {
                pr("updating to active");
                var temp_data = await model.updateOne({ _id: result._id }, { account_status: "active" });
                pr("temp_data= ", temp_data);

               
                return {status:"ok" , message:  "Account is Activated Successfully"};


            } catch (error) {
                return {status:"error" , message:"something went wrong" } ;
            }


            //
        }
        else {

            return {status:"error" , message:"Account Not Registered" } ;
        }



    }


    async function main(data) {
        connect_to_db();
        let result;
        // json_data = data; pr("json data is: ", json_data);
        // result = validate_and_trim_data(json_data);
        // if (!result) {
        //     mongoose.connection.close();
        //     return "missing data"
        // };
        result = await activate_account(data);
        mongoose.connection.close();
        return result;
    }

    // main({ email: "mad_max@gmail.com", name: "mohan", password: "342101" , token_str: "0dd1572c0987e4f1ce08659b371d88406e389015a12a1cb178",u_id: "czd0a1a2f4ec4aa76b3ef2" }).then(data => {
    //     pr("returned data  main is: ", data);
    
    // }).catch(error => {
    //     pr("error from main ", error);
    // });

    // http://localhost:3000/activate/momoland@gmail.com/token_str/afc373f842e2c5189ac61b3e3160902d743633fcf9bfc51b
module.exports = main;

