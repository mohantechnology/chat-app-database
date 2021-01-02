
    require('dotenv').config(); 
    
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
    var profile_schema  =  require("./schema/profile");
    var user_detail_schema = require("./schema/user_detail");
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






    async function save_unreaded_message(json_data) {
        //i


        // let result1;


        // pr("incoming data at fetch _profile ", json_data);
    
        // //findOne user exist in user_detail
    
        // let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");
    
        // // pr("Finding data is; ", { email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    
        // result1 = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
        // pr("reslut of model 0 is: ", result1);
    
    
         
    
    
        // if (result1 == null || result1.account_status != "active") {
        //     return { status: "error", message: "Not a valid user" }
        // }
    








             ///save to  send_mail in  your collection
                let model1  =  mongoose.models[json_data.u_id] === undefined ?  mongoose.model (json_data.u_id,profile_schema) :  mongoose.model (json_data.u_id); 
                // pr("monosees schemaafirst -- are: '",mongoose.model[json_data.name] ); 
                // pr("monosees schemaa are: '",mongoose.models[json_data.name]); 
                 let   result = await  model1.updateOne (
                        { friend_u_id: json_data.friend_u_id},
                        {"$push":{sent_message :{date:json_data.date,
                                                    time:json_data.time,
                                                    message:json_data.message,
                                                    direction:"out",
                                               }}}); 
                                    
                pr("result sent_message is: '",result); 
                if(result== null || result.nModified == 0){
                    return {status:"error", message :"Not able to send message. Please Retry Again "};
                }
                let model2  = mongoose.models[json_data.friend_u_id]  === undefined ?  mongoose.model (json_data.friend_u_id,profile_schema) :  mongoose.model (json_data.friend_u_id); 
                // pr("monosees schemaa are: '",mongoose.models.(json_data.name)); 
                // pr("monosees schemaa are: '",mongoose.models[json_data.friend_name]); 

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
     
        mongoose.connection.close();
        return result;
    }



    main({ email: "maggi@gmail.com", name: "maggi", password: "123456" ,u_id:"cz483c8e7a8ffb75a7530e",friend_u_id:"czd73fb9342f6aaba3e400" ,time:"12:58",date: "12/28/2020" ,message:"****maa hoo magii ->tu haa mohan" }).then(data => {
            pr("returned data  main is: ", data);
        
        }).catch(error => {
            pr("error from main ", error);
        });


module.exports = main;

