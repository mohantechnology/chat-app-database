
    require('dotenv').config(); 
    
const { json } = require('express');
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
       

       let result; 
        let result2; 
        let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

        // pr("Finding data is; ", { email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    
        result = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
        pr("reslut of model 0 is checking: ", result);
    
    
         
    
    
        if (result == null || result.account_status != "active") {
            return { status: "error", message: "Not a valid user" }
        }
    
       //find u_id of sender 
 if(json_data.signal==1){
   result2 = await model0.findOne({p_id: json_data.friend_p_id });
        pr("reslut of model 0 is: ", result);

    if(!result2){
        return {status: "error",message:"Friend Not Exists"}; 
    }
    json_data.friend_u_id = result2.u_id; 
 //notify friend that you have accepted request 
  let result3 = await model0.updateOne({u_id:result2.u_id} , {$push:{
      notification: {message: json_data.name + " Accepted your Friend Request ",
      "current_time":json_data.time,
      img:result.img,
      pro_mess:result.pro_mess,
      "date":json_data.date,
      direction:"ser"
        
    }
        
  }} ); 
  // pull that friend from request list ;
//   /pz9010673a097de53c9811

  let result4 = await model0.updateOne({u_id:json_data.u_id} , {"$pull":{
    friend_request: { sender_p_id:json_data.friend_p_id}}     } ); 

pr("result 4 is: ",result4); 
pr("result2 is: ",result2) ; 
//add sender p_id to your friendlist [p_id]
let result5 = await model0.updateOne({u_id:json_data.u_id} , {"$push":{
    friend_list: { sender_p_id:json_data.friend_p_id}}     } ); 
// also add to friend list[ p_id]

let result6 = await model0.updateOne({u_id:result2.u_id} , {"$push":{
    friend_list: { sender_p_id:json_data.p_id}}     } ); 
// also remove from friend's  sender request ; 
let result7 = await model0.updateOne({u_id:result2.u_id} , {"$pull":{
    sended_request: { sender_p_id:json_data.p_id}}     } ); 
  
  
  
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
                // pr("documetn is: ", document1);
                result = await document1.save();

                console.log("result of save is; ");



            } catch (error) {

                console.log((error))
                return {status: "error", message: "something went wrong " };
                
            }


            //
        }
        else {

            // return{ status: "ok", message:  "Already  added to friend list "};
        }




 // also  add your friend to your collection

        let model2  =  mongoose.models[json_data.u_id] === undefined ?  mongoose.model (json_data.u_id,profile_schema) :  mongoose.model (json_data.u_id); 

      

           let   document2 = new model2 ( {
                 friend_u_id:json_data.friend_u_id,
                 friend_name:result2.name,
                 chat_message:  [
                    {message: result2.name + " Now  Added as your Friend ",
                     "current_time":json_data.time,
                     "date":json_data.date,
                     direction:"ser"
                       
                   }],
                 is_blocked:false
             })
            try {
                // pr("documetn is: ", document2);
                result = await document2.save();

                console.log("result of save is; ",);

            //    return{ status: "ok", message:  "Successfully added to friend list"};
            } catch (error) {

                console.log((error))
                return {status: "error", message: "something went wrong " };
            }


            //
        
    }
    //endif

    //find all other request 
    
  let result_last = await model0.findOne({u_id:json_data.u_id}  );
  
//   pr("----finding of result_last is: ",result_last); 
  return {status:"ok",data:result_last.friend_request}; 


  }




    async function main(data) {
        connect_to_db();
        let result;
       
        result = await add_to_friend_list(data);
        mongoose.connection.close();
        return result;
    }

    
    //  main({ name: "mohan",friend_name:"mad_max"  , u_id: "czdf72dfce1710b41d4fa9" , friend_u_id: "czf96c5e50d312d5309048" ,date:"27/12/2020", time: "11:43" }).then(data=>{
    //      pr("main result is; ",data); 
    //  });



module.exports = main;

