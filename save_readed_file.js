
    require('dotenv').config(); 
    
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
   
    var profile_schema  =  require("./schema/profile");
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






    async function save_readed_file(json_data) {
        //i
                //   pr("data at readed messa",json_data);
             ///save to  chat_message in  your collection
                let model1  =  mongoose.models[json_data.u_id] === undefined ?  mongoose.model (json_data.u_id,profile_schema) :  mongoose.model (json_data.u_id); 
                // pr("monosees schemaafirst -- are: '",mongoose.model[json_data.name] ); 
                // pr("monosees schemaa are: '",mongoose.models[json_data.name]); 
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
                                    
                pr("result sent_message is: '",result); 
                if(result== null || result.nModified == 0){
                    pr({status:"error", message :"Not able to save message.  "});
                }
                let model2  = mongoose.models[json_data.friend_u_id]  === undefined ?  mongoose.model (json_data.friend_u_id,profile_schema) :  mongoose.model (json_data.friend_u_id); 
                // pr("monosees schemaa are: '",mongoose.models.(json_data.name)); 
                // pr("monosees schemaa are: '",mongoose.models[json_data.friend_name]); 

                // save chat_message to your friends collection 
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
                pr ({status:"error", message :"Not able to send message. Please Retry Again "});
            }
          
           return {status: "ok" ,message:   "message sended sucessfully"}; 
   
    }


 
    async function main(data) {
        connect_to_db();
        console.log("savereaded file ",data); 
        let result = await save_readed_file(data);  
       
        mongoose.connection.close();
        // pr("save readed"); 
        return result;
    }



    // main({ email: "mad_max@gmail.com", name: "mad_max", password: "123456" ,u_id:"czf96c5e50d312d5309048",friend_u_id:"czdf72dfce1710b41d4fa9" ,time:"12:58",date: "12/28/2020" ,message:"))))maa hoo mad_max ->tu haa mohan" }).then(data => {
    //         pr("returned data  main is: ", data);
        
    //     }).catch(error => {
    //         pr("error from main ", error);
    //     });


module.exports = main;

