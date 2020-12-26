
    require('dotenv').config(); 
    
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
    var json_data;
    var profile_schema; 
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

        profile_schema = new mongoose.Schema({
            friend_name: String,
            friend_email: String,
            chat_message: [] ,
            recieved_message:[],
            sent_message:[],
            is_blocked:Boolean
        
        });
     
    

    }

    async function save_unreaded_message() {
        //i


                let model1  =  mongoose.models[json_data.name] === undefined ?  mongoose.model (json_data.name,profile_schema) :  mongoose.model (json_data.name); 
                // pr("monosees schemaafirst -- are: '",mongoose.model[json_data.name] ); 
                // pr("monosees schemaa are: '",mongoose.models[json_data.name]); 
                    result = await  model1.updateOne (
                        { friend_name: json_data.friend_name},
                        {"$push":{sent_message :{date:json_data.date,
                                                    time:json_data.time,
                                                    message:json_data.message,
                                                    direction:"out",
                                               }}}); 
                                    
                                            
                let model2  = mongoose.models[json_data.friend_name]  === undefined ?  mongoose.model (json_data.friend_name,profile_schema) :  mongoose.model (json_data.friend_name); 
                // pr("monosees schemaa are: '",mongoose.models.(json_data.name)); 
                // pr("monosees schemaa are: '",mongoose.models[json_data.friend_name]); 
                result = await  model2.updateOne ({ friend_name: json_data.name},
                    {"$push":{recieved_message:{date:json_data.date,
                    time:json_data.time,
                    message:json_data.message,
                    direction:"in",
               }}});
          
           return  "message sended sucessfully"; 
   
    }



    async function main(data) {
        connect_to_db();
        let result;
        json_data = data;


        if(!profile_schema){
            create_schema_model(); 
        }
        
        result = await save_unreaded_message();
        mongoose.connection.close();
        return result;
    }



    // main({ name:"mad_max", friend_name:"magic_masala", message:"########mad_max  sended the message but magic masala  not recieved " }).then(data=>{
    //     pr("main result is; ",data); 
    // });


module.exports = main;
