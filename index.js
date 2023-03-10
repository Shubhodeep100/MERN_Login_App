import { fileURLToPath } from 'url'
import { dirname } from 'path'
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 9002
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
import path from 'path'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


app.use(express.static(path.join(__dirname, "./login-and-register-app/build")));
app.get("*", function (_, res) {
  res.sendFile(path.join(__dirname, "./login-and-register-app/build/index.html"),
  function (err) {
    res.status(500).send(err);
  }
  );
})

mongoose.set('strictQuery', false)
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    app.listen(9002, () => {
      console.log("BE started at port 9002");
    });
    console.log("DB is Connected");
  }
);

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



