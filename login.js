
    require('dotenv').config(); 
    
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
    var json_data;
    var  user_detail_schema; 
    var model ; 
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





 function  create_schema_model (){

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
    

    }

    async function check_login_detail() {
      // save readed message to collection.chat_message

         // save message to your collection.chat_message 
                let model1  =  mongoose.models["user_detail"] === undefined ?  mongoose.model ("user_detail", user_detail_schema) :  mongoose.model ("user_detail"); 
     

                    result = await  model1.findOne({email:json_data.email,password:json_data.password}); 
                    pr("result of login is: ",result); 
                    if(result ){
                        return {name:result.name,email:result.email,status:"ok"}; 
                    }
                    else{
                        return {status:"error" ,message:"Account Not Registered "}; 
                    }
    }






    async function main(data) {
        connect_to_db();
        let result;
        json_data = data;


        if(! user_detail_schema){
            create_schema_model(); 
        }
        
        result = await check_login_detail();
        mongoose.connection.close();
        return result ; 
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


// main({ name:"mandingos", friend_name:"mohan", message:"*__( 0<<>>0 )______mandingos send message to maoh" }); 
// main({ name:"mandingos", friend_name:"mohan", message:"&&&&mandingo sends to mohan?" }); 
// main({ name:"mohan", friend_name:"mandingos", message:"&&mohan send to madingo ?" }) ;
module.exports = main;

