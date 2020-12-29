
    require('dotenv').config(); 
    
const { json } = require('express');
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




    // function validate_and_trim_data() {
    //     if (json_data && json_data.name  && json_data.friend_name && json_data.friend_email) {
    //         json_data.name = json_data.name.trim();
    //         json_data.friend_email = json_data.friend_email.trim();
    //         json_data.friend_name = json_data.friend_name.trim();


    //     } else {
    //         return false;
    //     }

    //     if ( json_data.name==""  && json_data.friend_name=="" && json_data.friend_email==""){
    //          return false 
    //     }
    //     else {
    //         // pr("reutrn flase"); 
    //         return true;
    //     }

    // }


   

    async function add_to_friend_list(json_data) {
       

     //add yourself to your friend collection
     let model1  = mongoose.models[json_data.friend_u_id]  === undefined ?  mongoose.model (json_data.friend_u_id,profile_schema) :  mongoose.model (json_data.friend_u_id);


 //check if you are added to your  friend  list or not 
        result = await model1.findOne({ friend_u_id: json_data.u_id} );

   // if No then add yourself to your friendl list 
        if (!result) {

           let   document1 = new model1 ( {
                 friend_name:json_data.name,
                 friend_u_id: json_data.u_id,
                 chat_message:[
                     {message: json_data.name + " Accepted your Friend Request ",
                      "current_time":json_data.time,
                      "date":json_data.date,
                      direction:"ser"
                        
                    }],
                 is_blocked:false
             })
            try {
                pr("documetn is: ", document1);
                result = await document1.save();

                console.log("result of save is; ");



            } catch (error) {

                console.log((error))
                return {status: "error", message: "something went wrong " };
                
            }


            //
        }
        else {

            return{ status: "ok", message:  "Already  added to friend list "};
        }




 // also  add your friend to your collection

        let model2  =  mongoose.models[json_data.u_id] === undefined ?  mongoose.model (json_data.u_id,profile_schema) :  mongoose.model (json_data.u_id); 

      

           let   document2 = new model2 ( {
                 friend_u_id:json_data.friend_u_id,
                 friend_name:json_data.friend_name,
                 chat_message:  [
                    {message: json_data.friend_name + "Now  Added as your Friend ",
                     "current_time":json_data.time,
                     "date":json_data.date,
                     direction:"ser"
                       
                   }],
                 is_blocked:false
             })
            try {
                pr("documetn is: ", document2);
                result = await document2.save();

                console.log("result of save is; ",);

               return{ status: "ok", message:  "Successfully added to friend list"};
            } catch (error) {

                console.log((error))
                return {status: "error", message: "something went wrong " };
            }


            //
        
  



    }




    async function main(data) {
        connect_to_db();
        let result;
     
    
        
        result = await add_to_friend_list(data);
        mongoose.connection.close();
        return result;
    }

    
     main({ name: "mohan",friend_name:"mad_max"  , u_id: "czdf72dfce1710b41d4fa9" , friend_u_id: "czf96c5e50d312d5309048" ,date:"27/12/2020", time: "11:43" }).then(data=>{
         pr("main result is; ",data); 
     });



module.exports = main;

