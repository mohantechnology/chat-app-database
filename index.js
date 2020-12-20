const { json } = require("express");
const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const save_email = require(__dirname + '/save_email');
const activate_account = require(__dirname + '/activate_account');


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
    pr(req.url); 
    save_email({ email: "example4@gmail.com  ", name: "mandingo", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}).
    then(data=>{
        pr("then " ,data);
        res.send("ok");  
    }).catch(error=>{
        pr("catch",error); 
    }); 

});


app.get("/register", (req, res) => {
    pr(req.url); 
    save_email({ email: "example4@gmail.com  ", name: "mandingo", pass: "1re3456" ,token_str:"mystring",token_no:"mystring"}).
    then(data=>{
        pr("then " ,data);
        res.send("ok");  
    }).catch(error=>{
        pr("catch",error); 
    }); 

});
app.get("/activate", (req, res) => {
    // pr(req.url); 
    activate_account({ email: " example4@gmail.com ", token_no:"mystring" })
    .then(data=>{     
        res.send(data);  
    }).catch(error=>{
        pr("catch",error); 
    }); 

});
console.log(activate_account); 


app.listen(port, () => {
    console.log("listening to port " + port);
})


