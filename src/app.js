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



const userShema=Joi.object({
    name:Joi.string().min(3).max(30).required()  
})

const messageShema = Joi.object({
    to:Joi.string().min(3).max(30).required(),
    text:Joi.string().min(1).required(),
    type:Joi.string().min(1)
})

try {
    await mongoClient.connect();
    console.log(" Mongodb conectado com sucesso!")
}catch(err){
    console.log(err)
}
const db = mongoClient.db("batepapoUol")
const userCollection=db.collection("users")
const messagesCollection= db.collection("menssages")


app.post("/participants", async (req,res)=>{ //cadastro
const {name}=req.body
 const {error, value}= userShema.validate({name})
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

 }catch(err){
    console.log(err)
 }
})


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



app.post("/messages",async (req,res)=>{
    const {to,text,type}= req.body
    const {user}=req.headers
    const {error,value}=messageShema.validate({to:to,text:text,type:type})
    if(error){
        return res.status(422)
    }
    if (!(type=="private_message" || type=="message" )){
        return res.status(422).send("type precisa estar no formato!")
    }
    const message={
        from:user,
        to:to,
        text:text,
        type:type,
        time: dayjs().format("HH:mm:ss")
    }

    try{
       await messagesCollection.insertOne(message)
       console.log("mensagem enviada!")
       console.log(message)
        return res.status(201)
    }catch(err){
        console.log(err)
    }   
     
})

app.get("/messages",async (req,res)=>{
 try{
    const boxMessages =await messagesCollection.find().toArray()
    res.send(boxMessages)
 }catch (err){
    console.log(err)
 }
})


app.listen(5000, ()=> console.log("app rodando"))