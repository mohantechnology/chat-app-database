
    require('dotenv').config(); 
    
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
   
    var profile_schema  =  require("./schema/profile");


    function connect_to_db() {
        mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => { });

    }

    async function save_readed_file(json_data) {
 
             ///save to  chat_message in  your collection
                let model1  =  mongoose.models[json_data.u_id] === undefined ?  mongoose.model (json_data.u_id,profile_schema) :  mongoose.model (json_data.u_id); 
   
                    result = await  model1.updateOne (
                        { friend_u_id: json_data.friend_u_id},
                        {"$push":{chat_message :{date:json_data.date,
                                                    time:json_data.time,
                                                    message:json_data.message,
                                                    direction:"out",
                                                    mess_type:"file",
                                                    file_name: json_data.file_name,
                                                    file_link: json_data.file_link,
                                                    mime_type: json_data.mime_type,
                                                    folder_name:json_data.folder_name
                                               }}}); 
 
                if(result== null || result.nModified == 0){
                    return ({status:"error", message :"Not able to save message.  "});
                }
                let model2  = mongoose.models[json_data.friend_u_id]  === undefined ?  mongoose.model (json_data.friend_u_id,profile_schema) :  mongoose.model (json_data.friend_u_id); 
 
                result = await  model2.updateOne ({ friend_u_id: json_data.u_id},
                    {"$push":{chat_message:{date:json_data.date,
                    time:json_data.time,
                    message:json_data.message,
                    direction:"in",
                    mess_type:"file",
                    file_name: json_data.file_name,
                    file_link: json_data.file_link,
                    mime_type: json_data.mime_type,
                    folder_name:json_data.folder_name
               }}});

               if(result== null || result.nModified == 0){
                return ({status:"error", message :"Not able to save message.  "});
            }
          
           return {status: "ok" ,message:   "message sended sucessfully"}; 
   
    }

   async function main(data) {
        connect_to_db();
        let result = await save_readed_file(data);  
        return result;
    }



module.exports = main;

