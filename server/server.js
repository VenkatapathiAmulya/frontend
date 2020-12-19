//Budget API

const express = require('express');
const cors = require('cors');
const app = express();

const path = require('path');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});




const port = 3000;

const secretKey = 'My super secret key';
const jwtMW = exjwt({
    secret:secretKey,
    algorithms: ['HS256']
});
const mongoose = require('mongoose');
const personal_budget_Model = require('./models/personal_Budget');
const users = require('./models/users');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/',express.static('public'));

app.use(cors());

app.post('/getbudgetwithuser',jwtMW, (req, res) => {
    console.log("************ entered getbudgetwithuser method",req.body.username)
    mongoose.connect('mongodb://127.0.0.1:27017/budget_database', {
     useNewUrlParser:true,
     useCreateIndex : true,
     useUnifiedTopology: true
    }).then(() => {
        personal_budget_Model.find({username:req.body.username}).then((output) => {
            console.log("output is ",output);
            res.send(output);
            mongoose.connection.close();
        })
    })
 });

 app.put('/update',jwtMW, (req, res) => {
    const id = req.body.id;
    console.log("^^^^^^^^^^^^^^^^^^ ",req.body.params)
    console.log("***************** entered post method of /update")
   let data = {username: req.body.params.username, title: req.body.params.title, budget: req.body.params.budget,expense : req.body.params.expense,color: req.body.params.color,id: req.body.id}
   console.log("^^^^^^^^^^^^^^^^^^^ data",data);
   mongoose.connect('mongodb://127.0.0.1:27017/budget_database', {
       useNewUrlParser:true,
       useCreateIndex : true,
       useUnifiedTopology: true
      }).then( () => {
          
       personal_budget_Model.update({id:id},data).then(output=>{
            console.log("&&&&&&&&&&& output after update",output);
            res.send(output);
           })
       })

})
app.delete('/delete/:id',jwtMW, (req, res) => {
    const id = req.params.id;

    console.log("^^^^^^^^^^^^^^^^^^ ",req.params)
    console.log("***************** entered post method of /delete")
   mongoose.connect('mongodb://127.0.0.1:27017/budget_database', {
       useNewUrlParser:true,
       useCreateIndex : true,
       useUnifiedTopology: true
      }).then( () => {
       personal_budget_Model.findOneAndRemove({id:id}).exec().then(output=>{
            console.log("&&&&&&&&&&&  deleted ",output);
            res.send(output);
           })
       })

})
 app.post('/getbudgetwithid',jwtMW, (req, res) => {
    const id = req.body.id;
    console.log("********** id",id);
    mongoose.connect('mongodb://127.0.0.1:27017/budget_database', {
     useNewUrlParser:true,
     useCreateIndex : true,
     useUnifiedTopology: true
    }).then(() => {
        personal_budget_Model.find({id:id}).then((output) => {
            console.log("output is ",output);
            res.send(output);
            mongoose.connection.close();
        })
    })
 });
 app.post('/register', (req, res) => {
     let userdata;
     console.log("***************** entered post method of /register")
    let data = {firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.username,password: req.body.password,id: req.body.id}
    mongoose.connect('mongodb://127.0.0.1:27017/budget_database', {
        useNewUrlParser:true,
        useCreateIndex : true,
        useUnifiedTopology: true
       }).then( () => {
           
        users.find({username:data.username}).then((output) => {
            console.log("output is ",output);
            if(output){
                console.log("&&&&&&&&&&&& entered");
                //  return 'Username "' + data.username + '" is already taken'
            }
            
        }).then(()=>{
            users.find({}).then((output) => {
                console.log("output is ",output);
                userdata = output;
                console.log("&&&&&&&&&&&&& userdata",userdata);
                data.id = userdata.length?Math.max(...userdata.map(x=>x.id))+1:1;
        
                    console.log("^^^^^^^^^^^ id ",data.id);
                })


        .then(()=>{
                users.insertMany(data, (error, newDataentered) => {
                    console.log(newDataentered);
                    console.log(data);
                       if(newDataentered) {
                           res.send(newDataentered);
                       } else {
                        res.send(error);
                       }
                         mongoose.connection.close();
                   })
            })
        })
       })

})
app.post('/add',(req, res) => {
    let userbudgetdata;
    console.log("***************** entered post method of /add")
   let data = {username: req.body.username, title: req.body.title, budget: req.body.budget,color: req.body.color,expense : req.body.expense,id: req.body.id}
   mongoose.connect('mongodb://127.0.0.1:27017/budget_database', {
       useNewUrlParser:true,
       useCreateIndex : true,
       useUnifiedTopology: true
      }).then( () => {
          
       personal_budget_Model.find({title:data.title}).then((output) => {
           console.log("output is ",output);
           if(output){
               console.log("&&&&&&&&&&&& entered");
               // return 'Username "' + data.username + '" is already taken'
           }
           
       }).then(()=>{
           personal_budget_Model.find({}).then((output) => {
               console.log("output is ",output);
               userbudgetdata = output;
               console.log("&&&&&&&&&&&&& budget data of user",userbudgetdata);
               data.id = userbudgetdata.length?Math.max(...userbudgetdata.map(x=>x.id))+1:1;
       
                   console.log("^^^^^^^^^^^ id ",data.id);
               })


       .then(()=>{
               personal_budget_Model.insertMany(data, (error, newDataentered) => {
                   console.log(newDataentered);
                   console.log(data);
                      if(newDataentered) {
                          res.send(newDataentered);
                      } else {
                       res.send(error);
                      }
                        mongoose.connection.close();
                  })
           })
       })
      })

})

app.post('/login',(req,res)=>{
    let foundUser = false;
    const username = req.body.username;
    const password = req.body.password;

    mongoose.connect('mongodb://127.0.0.1:27017/budget_database', {
        useNewUrlParser:true,
        useCreateIndex : true,
        useUnifiedTopology: true
       }).then(() => {
           users.find({username:username,password:password}).then((output) => {
               console.log("output is ********************",output);
               let token = jwt.sign({id:output.id,username:output.username},secretKey,{expiresIn: 10000});
            foundUser = true;
            res.json({
                success: true,
                err:null,
                user:username,
                token,
                expiresIn: 10000
            });
               mongoose.connection.close();
           }) 
       }) 

})

app.use(function (err,req,res,next){
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err:'Username or password is incorrect 2'
        });
    }
    else {
        next(err);
    }
});


 app.post('/budget',jwtMW, (req, res) => {
    let data = {id: req.body.id, title: req.body.title, budget: req.body.budget, color: req.body.color}
    mongoose.connect('mongodb://127.0.0.1:27017/budget_database', {
        useNewUrlParser:true,
        useCreateIndex : true,
        useUnifiedTopology: true
       }).then( () => {
           personal_budget_Model.insertMany(data, (error, newDataentered) => {
            console.log(newDataentered);
            console.log(data);
               if(newDataentered) {
                   res.send(newDataentered);
               } else {
                res.send(error);
               }
               mongoose.connection.close();
           })
       })
})


app.listen(port,() => {
    console.log('API served at http://localhost:'+ port)
});