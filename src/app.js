import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"


const app= express()
app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Hello world!!")
})



app.listen(5000, ()=> console.log("app rodando"))