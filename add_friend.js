
    require('dotenv').config(); 
    
const { json } = require('express');
    const mongoose = require("mongoose");
    let link = process.env.DB_LINK; 
    var json_data;
    var model ; 
    var profile_schema; 
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




    function validate_and_trim_data() {
        if (json_data && json_data.name  && json_data.friend_name && json_data.friend_email) {
            json_data.name = json_data.name.trim();
            json_data.friend_email = json_data.friend_email.trim();
            json_data.friend_name = json_data.friend_name.trim();


        } else {
            return false;
        }

        if ( json_data.name==""  && json_data.friend_name=="" && json_data.friend_email==""){
             return false 
        }
        else {
            // pr("reutrn flase"); 
            return true;
        }

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

    async function add_to_friend_list() {
        //if acitivate method is token  number check number else check token string 


     //add yourself to your friend collection
     let model1  = mongoose.models[json_data.friend_name]  === undefined ?  mongoose.model (json_data.friend_name,profile_schema) :  mongoose.model (json_data.friend_name);


 //check if you are added to your  friend  list or not 
        result = await model1.findOne({ friend_name: json_data.name} );

   
        if (!result) {

           let   document1 = new model1 ( {
                 friend_name:json_data.name,
                 friend_email:json_data.email,
                 chat_message:[{"current_date" :[{message: json_data.name + " Added in list" ,"current_time":"1:20"}]}],
                 is_blocked:false
             })
            try {
                pr("documetn is: ", document1);
                result = await document1.save();

                console.log("result of save is; ");



            } catch (error) {

                console.log((error))
                return "something went wrong " ;
            }


            //
        }
        else {

            return "Already  added to friend list ";
        }




 // also  add your friend to your collection

        let model2  =  mongoose.models[json_data.name] === undefined ?  mongoose.model (json_data.name,profile_schema) :  mongoose.model (json_data.name); 

      

           let   document2 = new model2 ( {
                 friend_name:json_data.friend_name,
                 friend_email:json_data.friend_email,
                 chat_message:[{"current_date" :[{message: json_data.friend_name +  " Added in list" ,"current_time":"1:20"}]}],
                 is_blocked:false
             })
            try {
                pr("documetn is: ", document2);
                result = await document2.save();

                console.log("result of save is; ");


                return "Successfully added to friend list";
            } catch (error) {

                console.log((error))
                return "something went wrong " ;
            }


            //
        
  



    }




    async function main(data) {
        connect_to_db();
        let result;
        json_data = data; pr("json data is: ", json_data);
        result = validate_and_trim_data(json_data);
        if (!result) {
            mongoose.connection.close();
            return "missing data"
        };

        if(!model){
            create_schema_model(); 
        }
        
        result = await add_to_friend_list();
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



module.exports = main;

