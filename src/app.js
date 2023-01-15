import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import dayjs from "dayjs"
import Joi from "joi"
dotenv.config()

const app= express()
app.use(cors())
app.use(express.json())

const mongoClient = new MongoClient(process.env.MONGO_URI)

const lastStatus=dayjs().format("HH:MM:SS")



const userSchema=Joi.object({
    name:Joi.string().min(3).max(30).required()
})

try {
    await mongoClient.connect();
    console.log(" Mongodb conectado com sucesso!")
}catch(err){
    console.log(err)
}
const db = mongoClient.db("batepapoUol")
const userCollection=db.collection("users")


app.get("/participants", (req,res)=>{
    
})

app.post("/participants", (req,res)=>{ //cadastro
const {name}=req.body
//userCollection.find({name})
})


app.post("/messages", (req,res)=>{
    
})

app.get("/messages", (req,res)=>{
 
})



app.listen(5000, ()=> console.log("app rodando"))