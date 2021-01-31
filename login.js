
    require('dotenv').config(); 
    var crypto = require("crypto");
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
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
        mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify:false }).catch(error => { });

    }




    function trim_data(json_data) {
        if ( json_data &&  json_data.email && json_data.password) {
            json_data.email = json_data.email.trim();
            json_data.password = json_data.password.trim();
        } else {
            return false;
        }
        if (json_data.email == "" || json_data.password == "") {
            return false;
        } else {
            return json_data;
        }
    
    }



    async function check_login_detail(json_data) {
      // save readed message to collection.chat_message

         // save message to your collection.chat_message 
                let model1  =  mongoose.models["user_detail"] === undefined ?  mongoose.model ("user_detail", user_detail_schema) :  mongoose.model ("user_detail"); 
      
             
        
                   let temp_id =  crypto.randomBytes(10).toString('hex');
                //    console.log("find and update ",{email:json_data.email,password:json_data.password},{$set:{token:temp_id}}); 
                    result = await  model1.findOneAndUpdate({email:json_data.email,password:json_data.password},{$set:{token:temp_id}}); 
                    pr("result of login is: ",result); 
                    if(result ){
                        return {name:result.name,email:result.email,status:"ok" ,token:temp_id ,u_id:result.u_id ,p_id:result.p_id}; 
                    }
                    else{
                        return {status:"error" ,message:"Invalid Login Credentials"}; 
                    }
    }






    async function main(data) {
        connect_to_db();
        let result;
        json_data = 
        result = trim_data(data )
         
        if(!result){
            // mongoose.connection.close();
            return {status:"error",message:"missing data"}; 
        }
        result = await check_login_detail(result);
        // mongoose.connection.close();
        return result ; 
    }


// main({ email: "mohan3@gmail.com ", name: "road" }).then(data => {
//     pr("returned data  main is: ", data);

// }).catch(error => {
//     pr("error from main ", error);
// });

module.exports = main;

