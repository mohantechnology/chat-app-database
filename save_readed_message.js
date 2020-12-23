
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

    async function save_readed_message() {
      // save readed message to collection.chat_message

         // save message to your collection.chat_message 
                let model1  =  mongoose.models[json_data.name] === undefined ?  mongoose.model (json_data.name,profile_schema) :  mongoose.model (json_data.name); 
     

                    result = await  model1.updateOne (
                        { friend_name: json_data.friend_name},
                        {"$push":{chat_message :{
                                                    date:json_data.date,
                                                    time:json_data.time,
                                                    message:json_data.message,
                                                    direction:"out",
                                               }}}); 
                                    
                   
         // save message to your friend collection.chat_message                       
                let model2  = mongoose.models[json_data.friend_name]  === undefined ?  mongoose.model (json_data.friend_name,profile_schema) :  mongoose.model (json_data.friend_name); 
  
                result = await  model2.updateOne ({ friend_name: json_data.name},
                    {"$push":{chat_message:{
                    date:json_data.date,
                    time:json_data.time,
                    message:json_data.message,
                    direction:"in",
               }}});
          
           return  "message saved sucessfully"; 
   
    }






    async function main(data) {
        connect_to_db();
        let result;
        json_data = data;


        if(!profile_schema){
            create_schema_model(); 
        }
        
        result = await save_readed_message();
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


// main({ name:"mandingos", friend_name:"mohan", message:"*__( 0<<>>0 )______mandingos send message to maoh" }); 
// main({ name:"mandingos", friend_name:"mohan", message:"&&&&mandingo sends to mohan?" }); 
// main({ name:"mohan", friend_name:"mandingos", message:"&&mohan send to madingo ?" }) ;
module.exports = main;

