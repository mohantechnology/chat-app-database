
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

async function fetch_friend() {
    // read all recived message from friends 

    // save message to your collection.chat_message 
    pr("incoming data at fetch _profile ", json_data);
    let model1 = mongoose.models[json_data.name] === undefined ? mongoose.model(json_data.name, profile_schema) : mongoose.model(json_data.name);

    result = await model1.findOne({ friend_name: json_data.friend_name }, { recieved_message: 1 });
    // result = JSON.stringify(result,null,4); 
    pr("result of find is: ",result);

    //transfer recived message to your chat message in your collection 

    await model1.updateOne({ friend_name: json_data.friend_name }, { "$push": { chat_message: result.recieved_message } });
    await model1.updateOne({ friend_name: json_data.friend_name }, { "$set": { recieved_message: [] } });

   // transfer friend  send  message to  friend chat message in  friend's collection 
    let model2 = mongoose.models[json_data.friend_name] === undefined ? mongoose.model(json_data.friend_name, profile_schema) : mongoose.model(json_data.friend_name);

    let result_friend = await model2.findOne({ friend_name: json_data.name }, { sent_message: 1 })
    await model2.updateOne({ friend_name: json_data.name }, { "$push": { chat_message: result_friend.sent_message } });
    await model2.updateOne({ friend_name: json_data.name }, { "$set": { sent_message: [] } });



    return { status: "ok", recieved_message: result.recieved_message };



    //   pr("result of find is: ",{ status:"ok", recieved_message:  result.recieved_message}); 


    // for(let i =0; i<len; i++ ){
    // //    console.log(result[i].friend_name, " send you ",result[i].recieved_message.length); 
    // response.data[ result[i].friend_name ] = result[i].recieved_message.length;
    // // response.count = 
    // }

}






async function main(data) {
    connect_to_db();
    let result;
    json_data = data;
    create_schema_model();


    result = await fetch_friend();
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


main({ name:"magic_masala" , friend_name:  "mad_max"}).then(data=>{
 pr("result of main ",data); 
});

// main({ name:"", friend_name:"mohan", message:"&&&&mandingo sends to mohan?" }); 
// main({ name:"mohan", friend_name:"mandingos", message:"&&mohan send to madingo ?" }) ;
module.exports = main;

