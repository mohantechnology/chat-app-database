
    require('dotenv').config(); 
    
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
    var profile_schema  =  require("./schema/profile");
    var user_detail_schema = require("./schema/user_detail");

    function connect_to_db() {
        mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

    }

    async function save_unreaded_message(json_data) {
           ///save to  send_mail in  your collection
                let model1  =  mongoose.models[json_data.u_id] === undefined ?  mongoose.model (json_data.u_id,profile_schema) :  mongoose.model (json_data.u_id); 
 
                 let   result = await  model1.updateOne (
                        { friend_u_id: json_data.friend_u_id},
                        {"$push":{sent_message :{date:json_data.date,
                                                    time:json_data.time,
                                                    message:json_data.message,
                                                    direction:"out",
                                               }}}); 

                if(result== null || result.nModified == 0){
                    return {status:"error", message :"Not able to send message. Please Retry Again "};
                }
                let model2  = mongoose.models[json_data.friend_u_id]  === undefined ?  mongoose.model (json_data.friend_u_id,profile_schema) :  mongoose.model (json_data.friend_u_id); 

                // save recived message to your friends collection 
                result = await  model2.updateOne ({ friend_u_id: json_data.u_id},
                    {"$push":{recieved_message:{date:json_data.date,
                    time:json_data.time,
                    message:json_data.message,
                    direction:"in",
               }}});

               if(result== null || result.nModified == 0){
                return {status:"error", message :"Not able to send message. Please Retry Again "};
            }
          
           return {status: "ok" ,message:   "message sended sucessfully"}; 
   
    }



    async function main(data) {
        connect_to_db();
        let result= await save_unreaded_message(data); 
     
        // mongoose.connection.close();
        return result;
    }


module.exports = main;

