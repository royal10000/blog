const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config()

const MONGODB=process.env.MONGODB
const connectDB=async()=>await mongoose.connect(`${MONGODB}/blog`)
module.exports=connectDB