const { json } = require("express");
const express = require("express");
const bodyParser = require('body-parser')
const app = express(); 
const port = process.env.PORT || 9000;
const register = require(__dirname + '/register');
const activate_account = require(__dirname + '/activate_account');
const profile = require(__dirname + '/profile'); 
const accept_friend_request = require(__dirname + '/accept_friend_request'); 
const save_readed_message = require(__dirname + '/save_readed_message');
const save_readed_file = require(__dirname + '/save_readed_file');
const save_unreaded_file = require(__dirname + '/save_unreaded_file');
const save_unreaded_message = require(__dirname + '/save_unreaded_message');
const find_friend = require(__dirname + '/find_friend');
const send_friend_request = require(__dirname + '/send_friend_request');
const login = require(__dirname + '/login'); 
const display_noti = require(__dirname + '/display_noti'); 
const fetch_friend = require(__dirname + '/fetch_friend'); 
const check_user_details = require(__dirname + '/check_user_details'); 
const offline_user = require(__dirname + '/offline_user'); 
const update_prof = require(__dirname + '/update_prof'); 
const fetch_remain = require(__dirname + '/fetch_remain'); 
const transfer_file = require(__dirname + '/transfer_file'); 

const forgot_pass = require(__dirname + '/forgot_pass'); 
const new_pass = require(__dirname + '/new_pass'); 
const ver_reset_pass = require(__dirname + '/ver_reset_pass'); 




app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false}));


// const activate_account = require(__dirname + '/activate_account')



app.get("/",(req, res) => {
//    res.send(req.body); 
 
         res.json({"message":" sucessfully connected to api  using GET  "}); 
    }); 
    app.post("/", (req, res) => {
        res.json({"message":" sucessfully connected to api  using POST"}); 
    }); 

 
 
app.post("/register", (req, res) => {
   
 
    register(req.body).
    then(data=>{
 
        res.json(data);  
    }).catch(error=>{
 
        res.json({status: "error",message: "something went wrong"});  
    }); 

});

app.post("/activate", (req, res) => {
    // pr(req.url); 
 
    activate_account(req.body).
        then(data=>{
 
            res.json(data);  
        }).catch(error=>{
 
            res.json({status: "error",message: "something went wrong"});  
        }); 

});

app.post("/login", (req, res) => {
 login(req.body).then(data=>{  
         
        res.json(data); ;  
    }).catch(error=>{
     res.json({status:"error" ,message:"something went wrong"}); ;  
    }); 

});


app.post("/profile", (req, res) => {
 
    profile(req.body)
    .then(data=>{  
   
        res.json(data); ;  
    }).catch(error=>{
 
        res.json({status:"error" ,message:"something went wrong"}); ;  
    }); 

});



app.post("/find_friend", (req, res) => {
 

    find_friend(req.body)
    .then(data=>{  
  
        res.json(data); ;  
    }).catch(error=>{
 
        res.json({status:"error" ,message:"something went wrong"}); ;  
    }); 

});
app.post("/send_friend_request", (req, res) => {
   
 
    send_friend_request(req.body)
    .then(data=>{  
 
        res.json(data); ;  
    }).catch(error=>{
        res.json({status:"error" ,message:"something went wrong"}); ;  
    }); 

});



app.post("/accept_friend_request", (req, res) => {
 
    accept_friend_request(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{  
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});


app.post("/display_noti", (req, res) => {
 
    display_noti(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});



app.post("/transfer_file", (req, res) => {
 
 
    transfer_file(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
 
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});


app.post("/update_prof", (req, res) => {
 
 
    update_prof(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
     
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});


app.post("/fetch_friend", (req, res) => {
 
 
    fetch_friend(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
    //    console.log(error);
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});


app.post("/fetch_remain", (req, res) => {
 
    fetch_remain(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
   
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});

app.post("/check_user_details", (req, res) => {
 
    check_user_details(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
       
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});



app.post("/offline_user", (req, res) => {
  
offline_user(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{ 
      
        res.json({status:"error" ,message:"something went wrong"});  
    }); 

});

 
app.post("/save_readed_message", (req, res) => {
 

    save_readed_message(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        res.send(error.message);   
    }); 

});

app.post("/save_unreaded_message", (req, res) => {
 

    save_unreaded_message(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        res.send(error.message);   
    }); 

});




app.post("/save_readed_file", (req, res) => {
 
    save_readed_file(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        res.send(error.message);   
    }); 

});

app.post("/save_unreaded_file", (req, res) => {
 
    save_unreaded_file(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{    
    res.send(error.message);  
 
    }); 

});

app.post("/forgot_pass", (req, res) => {

 
    forgot_pass(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        res.send(error.message);  
    }); 

});


app.post("/new_pass", (req, res) => {
 
 
    new_pass(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        res.send(error.message);  
    }); 

});



app.post("/ver_reset_pass", (req, res) => {
 
 
    ver_reset_pass(req.body)
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        res.send(error.message);  
    }); 

});







app.post("*",(req,res)=>{
 res.status(404).send({status:"error",message:"page not found"}); 
 
}); 
app.listen(port, () => {
    console.log("listening to port " + port);
})


