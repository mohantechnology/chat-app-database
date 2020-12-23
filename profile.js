
require('dotenv').config();

const { json } = require('body-parser');
const mongoose = require("mongoose");
let link = process.env.DB_LINK;
var json_data;
var profile_schema;
var model;
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





function create_schema_model() {

    profile_schema = new mongoose.Schema({
        friend_name: String,
        friend_email: String,
        chat_message: [],
        recieved_message: [],
        sent_message: [],
        is_blocked: Boolean

    });



}

async function fetch_profile_data() {
    // read all recived message from friends 

    // save message to your collection.chat_message 
    let model1 = mongoose.models[json_data.name] === undefined ? mongoose.model(json_data.name, profile_schema) : mongoose.model(json_data.name);


    result = await  model1.find({},{friend_name:1,_id:0,recieved_message:1}) ; 
    // result = JSON.stringify(result,null,4); 
    pr("result of find is: ",result); 
    let i,len= result.length; 
    let response = {data:{}}; 
    for(let i =0; i<len; i++ ){
    //    console.log(result[i].friend_name, " send you ",result[i].recieved_message.length); 
    response.data[ result[i].friend_name ] = result[i].recieved_message.length;
    // response.count = 
    }
    return  response; 
    
}






async function main(data) {
    connect_to_db();
    let result;
    json_data = data;


    if (!profile_schema) {
        console.log("created schema model for ", json_data.name);
        create_schema_model();
    }

    result = await fetch_profile_data();
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


// main({ name: "mohan", email:"mohan@gmail.com"});
// main({ name:"", friend_name:"mohan", message:"&&&&mandingo sends to mohan?" }); 
// main({ name:"mohan", friend_name:"mandingos", message:"&&mohan send to madingo ?" }) ;
module.exports = main;

