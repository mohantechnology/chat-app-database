const { json } = require("express");
const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 9000;
const save_email = require(__dirname + '/save_email');
const activate_account = require(__dirname + '/activate_account');
const profile = require(__dirname + '/profile'); 
const add_friend = require(__dirname + '/add_friend'); 
const save_readed_message = require(__dirname + '/save_readed_message');
const save_unreaded_message = require(__dirname + '/save_unreaded_message');


var urlencodedParser = bodyParser.urlencoded({ extended: false }); 
// const activate_account = require(__dirname + '/activate_account')

function pr(r1, r2,r3,r4) {

    if(r1){
        console.log(r1)
    }

    if(r2){
        console.log(r2)
    }
    if(r3){
        console.log(r3)
    }
    if(r4){
        console.log(r4)
    }
} 
app.get("/", (req, res) => {
         res.sendFile( __dirname + "/index.html"); 
    }); 



 
app.get("/register", (req, res) => {
   
    pr(req.url); 
    save_email({email:  "mandingo@gmail.com ", name: "mandingo", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}).
    then(data=>{
        pr("then " ,data);
        res.send("ok");  
    }).catch(error=>{
        pr("catch",error); 
    }); 

});
app.get("/activate", (req, res) => {
    // pr(req.url); 


    activate_account({ email:  "magic_masala@gmail.com ",name:"magic_masala", token_no:"mystring" })
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        pr("catch",error); 
    }); 

});


app.get("/profile", (req, res) => {
    // pr(req.url);

    profile({ name: "mohan", pass:"1re3456" })
    .then(data=>{  
        data.response="success"   
        res.json(data); ;  
    }).catch(error=>{
        pr("catch",error); 

        res.json({response:"error" ,message:"something went wrong"}); ;  
    }); 

});


app.get("/add_friend", (req, res) => {
    // pr(req.url);
 
    add_friend({ name:"mandingos", friend_name:"mohan", email:"mohan@gmail.com", friend_email: "mandingos@gmail.com "})
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
        pr("catch",error); 
    }); 

});

app.get("/save_readed_message", (req, res) => {
    // pr(req.url); 


    save_readed_message({ name:"mandingos", friend_name:"mohan", message:"hello how are yoy mohan?" })
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        pr("catch",error); 
    }); 

});

app.get("/save_unreaded_message", (req, res) => {
    // pr(req.url); 


    save_unreaded_message({ name:"mandingos", friend_name:"mohan", message:"mandingos send message to mohan?" })
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        pr("catch",error); 
    }); 

});

app.listen(port, () => {
    console.log("listening to port " + port);
})


