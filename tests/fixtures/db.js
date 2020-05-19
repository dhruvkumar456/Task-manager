const mongoose=require('mongoose')
const User=require('../../src/models/users')
const Task=require('../../src/models/task')
const jwt=require('jsonwebtoken')

const useroneId=new mongoose.Types.ObjectId()
const userone={
    _id:useroneId,
    name:'something',
    email:'something1@gmail.com',
    password:'123456789023',
    tokens:[{
        token:jwt.sign({id:useroneId.toString()},process.env.JWT_SECRET)
    }]
}

const task1id=new mongoose.Types.ObjectId()
const task1={
    _id:task1id,
    description:'1st Task',
    completed:true,
    owner:userone._id
}

const task2={
    _id:new mongoose.Types.ObjectId(),
    description:'2nd Task',
    completed:true,
    owner:userone._id
}

const task3={
    _id:new mongoose.Types.ObjectId(),
    description:'3rd task',
    completed:false,
    owner:userone._id
}


const usertwoId=new mongoose.Types.ObjectId()
const usertwo={
    _id:usertwoId,
    name:'something2',
    email:'something2@gmail.com',
    password:'1234567890234',
    tokens:[{
        token:jwt.sign({id:usertwoId.toString()},process.env.JWT_SECRET)
    }]
}




const setdatabase=async()=>{
    await User.deleteMany()
    await Task.deleteMany()

    await new User(userone).save()
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()

    await new User(usertwo).save()
}


module.exports={
    useroneId,
    userone,
    setdatabase,
    usertwo,
    task1id
}