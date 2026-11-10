import mongoose from "mongoose"
import express from "express"
import router from "./route.js"
import { config } from "dotenv"

config()


export const app = express()


export const connectDB = async ()=>{

    const connectionString = `${process.env.MONGO_URI}/ci`
    console.log(connectionString)
    const conn = await mongoose.connect(connectionString)

    if(!conn){
        console.log('failed to connect to database')
        process.exit(1)
    }

    console.log('application connected with database')

}


app.use('/api', router)

const port = process.env.PORT || 6655

app.listen(port, async ()=>{
    await connectDB()
    console.log(`application is running on port ${port}`)
})