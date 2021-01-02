const { json } = require("express");
const express = require("express");
const bodyParser = require('body-parser')
const app = express(); 
const port = process.env.PORT || 9000;
const save_email = require(__dirname + '/save_email');
const activate_account = require(__dirname + '/activate_account');
const profile = require(__dirname + '/profile'); 
const accept_friend_request = require(__dirname + '/accept_friend_request'); 
const save_readed_message = require(__dirname + '/save_readed_message');
const save_unreaded_message = require(__dirname + '/save_unreaded_message');
const find_friend = require(__dirname + '/find_friend');
const send_friend_request = require(__dirname + '/send_friend_request');
const login = require(__dirname + '/login'); 


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false}));


// const activate_account = require(__dirname + '/activate_account')

function pr(r1, r2,r3,r4) {if(r1){console.log(r1)}if(r2){console.log(r2)}if(r3){console.log(r3)}if(r4){console.log(r4)}}


app.get("/",(req, res) => {
//    res.send(req.body); 
    // console.log("url is |\n",req.url); 
    // console.log(req.body); 
         res.json({"message":" sucessfully connected to api  using GET  "}); 
    }); 
    app.post("/", (req, res) => {
        res.json({"message":" sucessfully connected to api  using POST"}); 
    }); 


 
app.post("/register", (req, res) => {
   
    pr("incoming data ",req.body); 
    save_email(req.body).
    then(data=>{
        // pr("then " ,data);
        res.json(data);  
    }).catch(error=>{
        pr("catch",error);
        res.json({status: "error",message: "something went wrong"});  
    }); 

});

app.post("/activate", (req, res) => {
    // pr(req.url); 
    pr("incoming data to activate ",req.body); 

    activate_account(req.body).
        then(data=>{
            // pr("then " ,data);
            res.json(data);  
        }).catch(error=>{
            pr("catch",error);
            res.json({status: "error",message: "something went wrong"});  
        }); 

});

app.post("/login", (req, res) => {
    // pr(req.url);
    console.log("incoming data is; ")
    console.log(req.body); 
    login(req.body).then(data=>{  
         
        res.json(data); ;  
    }).catch(error=>{
        pr("catch",error); 

        res.json({status:"error" ,message:"something went wrong"}); ;  
    }); 

});


app.post("/profile", (req, res) => {
    // pr(req.url);

    profile(req.body)
    .then(data=>{  
       console.log(data); 
        res.json(data); ;  
    }).catch(error=>{
        pr("catch",error); 

        res.json({status:"error" ,message:"something went wrong"}); ;  
    }); 

});



app.post("/find_friend", (req, res) => {
    // pr(req.url);

    find_friend(req.body)
    .then(data=>{  
       console.log(data); 
        res.json(data); ;  
    }).catch(error=>{
        pr("catch",error); 

        res.json({status:"error" ,message:"something went wrong"}); ;  
    }); 

});
app.post("/send_friend_request", (req, res) => {
    // pr(req.url);
  ("incoming dat at model -index route ",req.body); 
    send_friend_request(req.body)
    .then(data=>{  
       console.log(data); 
        res.json(data); ;  
    }).catch(error=>{
        pr("catch",error); 

        res.json({status:"error" ,message:"something went wrong"}); ;  
    }); 

});



app.post("/accept_friend_request", (req, res) => {
    // pr(req.url);
 
    accept_friend_request(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
        pr("catch",error);
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});

app.post("/save_readed_message", (req, res) => {
    // pr(req.url); 


    save_readed_message({ name:"mandingos", friend_name:"mohan", message:"hello how are yoy mohan?" })
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        pr("catch",error); 
    }); 

});

app.post("/save_unreaded_message", (req, res) => {
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


