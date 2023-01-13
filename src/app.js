import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import dayjs from "dayjs"

dayjs().format()
const app= express()
app.use(cors())
app.use(express.json())

const participants= [{name: 'xxx1', lastStatus: dayjs()},{name: 'xxx3', lastStatus: dayjs()},{name: 'xxx2', lastStatus: dayjs()}]


app.get("/", (req,res)=>{
    res.send(participants)
})



app.listen(5000, ()=> console.log("app rodando"))