const express=require('express');
const jwt=require('jsonwebtoken')

require('./db/mongoose')//CONNECT TO THE LOCAL DATABASE...
const userRouter=require('./router/user')
const taskRouter=require('./router/task')

const app=express();

app.use(express.json());//TO GET DATA IN FORM OF OBJECTS..
app.use(userRouter)//TO USE THE USERS ROUTER HANDLING COMMANDS
app.use(taskRouter)

module.exports=app