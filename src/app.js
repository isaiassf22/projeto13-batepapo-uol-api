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

const mongoClient = new MongoClient(process.env.DATABASE_URL)

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


app.get("/participants", async (req,res)=>{
    try{
      const users = await userCollection.find().toArray()
        if(!users){
            return res.status(404)
        }
        res.send(users)
    }catch(err) {
        console.log(err)
        res.status(500)
    }
})

app.post("/participants", async (req,res)=>{ //cadastro
const {name}=req.body
 const {error, value}= userSchema.validate({name})
 if(error){
    return res.status(422).send("usuario não cadastrado! Coloque um nome valido")
 }
 try{
    const userExistent = await userCollection.findOne({name});
    if (userExistent){
        return res.status(409).send("Esse usuario já exite!");
    }
    await userCollection.insertOne({name, lastStatus:Date.now()})
    res.status(201).send("Usuario cadastrado com sucesso!")

 }catch{

 }
})


app.post("/messages",async (req,res)=>{
    
})

app.get("/messages",async (req,res)=>{
 
})


app.listen(5000, ()=> console.log("app rodando"))