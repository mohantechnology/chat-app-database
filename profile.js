
require('dotenv').config();

const { json } = require('body-parser');
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
// var json_data;
var user_detail_schema = require("./schema/user_detail");
var profile_schema = require("./schema/profile");
// var model;
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













async function fetch_profile_data(json_data) {


    let result;
    pr("incoming data at fetch _profile ", json_data);

    //findOne user exist in user_detail

    let model0 = mongoose.models["user_detail"] === undefined ? mongoose.model("user_detail", user_detail_schema) : mongoose.model("user_detail");

    // pr("Finding data is; ", { email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    //   result = await   model0.findOne({email: json_data.email, u_id:json_data.u_id,token:json_data.token});
    result = await model0.findOne({ email: json_data.email, token: json_data.token, u_id: json_data.u_id });
    pr("reslut of model 0 is: ", result);
    if (result == null ) {
        return { status: "error", message: "Not a valid user" };
    }
   if( result.account_status != "active"){
    return { status: "error", message: "Account is Not Activated" };
   }


    // let sender_arr = 
    let f_list_p_id = []; 
    for(let  i =0; i<result.friend_list.length; i++){
        f_list_p_id.push(result.friend_list[i].sender_p_id); 
    }
    pr("f_list p_id ", f_list_p_id); 
    let friend_result =   await model0.find({p_id:{$in:f_list_p_id}},{name:1,profile_img:1,pro_mess:1,u_id:1}); 

    //    pr("friend_result ",friend_result);
       

     //map friend_u_id -> detail   
    let table_friend_uid_to_detail = {}; 
    for(let  i =0; i<friend_result.length; i++){
        table_friend_uid_to_detail[friend_result[i].u_id] = friend_result[i]; 
    }
    // pr("talbie is: ",table_friend_uid_to_detail);  
    let response = { data: [] ,account_type:result.account_type  };
    response.name = result.name;
    response.img = result.profile_img;
    response.pro_mess = result.pro_mess;

    // console.log(mongoose.models);
    let model1 = mongoose.models[json_data.u_id] === undefined ? mongoose.model(json_data.u_id, profile_schema) : mongoose.model(json_data.u_id);
    //  pr("after model reigstration ",mongoose.models); 



    //find self profile in collection 
 let result_profile = await model1.find();
    if (result_profile) {
  
        let i, len = result_profile.length;
      for (let i = 0; i < len; i++) {
            //    console.log(result[i].friend_name, " send you ",result[i].recieved_message.length); 
// pr("i="+ i,result_profile[i]); 
            response.data.push({ name: result_profile[i].friend_name,
                 count: result_profile[i].recieved_message.length,
                 img:table_friend_uid_to_detail[result_profile[i].friend_u_id].profile_img ,
                  pro_mess:table_friend_uid_to_detail[result_profile[i].friend_u_id].pro_mess,
                   u_id: result_profile[i].friend_u_id });
             
            // response.count = 
        }
    }
    //#todo



    response.status = "ok"; 
    
    // pr("Final respose at profile ",response); 
    return response;
    // result = JSON.stringify(result,null,4); 


}






async function main(data) {
    connect_to_db();
    let result;
    result = await fetch_profile_data(data);
    mongoose.connection.close();
    return result;
}


// main({ email: "mad_max@gmail.com", name: "mad_max", password: "123456" ,u_id:"czf96c5e50d312d5309048" }).then(data => {
//     pr("returned data  main is: ", data);

// }).catch(error => {
//     pr("error from main ", error);
// });
module.exports = main;











