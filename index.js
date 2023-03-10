const express = require("express");
require("dotenv").config();
const dotenv = require("dotenv")
const path = require("path")
const connect = require('./configs/db.js')
// import { dirname } from 'path'
// import { fileURLToPath } from 'url'
const mongoose = require("mongoose");
const cors = require("cors")

mongoose.set('strictQuery', false)
const PORT = process.env.port || 9002
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// To serve the Frontend:
app.use(express.static(path.join(__dirname, "./login-and-register-app/build")));
app.get("*", function (_, res) {
  res.sendFile(path.join(__dirname, "./login-and-register-app/build/index.html"),
  function (err) {
    res.status(500).send(err);
  }
  );
})

// mongoose.connect(
//   PORT,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => {
//    app.listen(PORT, () => {
//     console.log(`BE start at ${PORT}`)
//    });
//    console.log("DB is connected")
//   }
// );

 app.listen(PORT, async () => {
   try {
     await connect();
     console.log(`Listening at ${PORT}`);
   } catch (error) {
     console.log(error.message);
   }
 });


const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// Routes
app.post("/login", (req, res) => {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({ message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password did'nt match"})
            }
        } else {
            res.send({message: "User not Registered"})
        }
    })
})

app.post("/register", (req,res) => {
  const {name, email, password} = req.body
  User.findOne({email: email}, (err, user) => {
    if(user){
        res.send({message: "User is already Registered"})
    } else {
          const user = new User({
            name,
            email,
            password
          })
          user.save(err => {
            if(err) {
              res.send(err)
            } else {
              res.send( { message: "Succesfully Registered, Please Login now." })
            }
          })
    }
  })

}) 



