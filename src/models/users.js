const mongoose=require('mongoose');
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invaid Email');
            }
        }
    },
    age:{
        type:Number,
        default:'0',
        validate(age){
            if(age<0){
                throw new Error('Age should be positive.');
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',//OF USER MODEL..
    foreignField:'owner'
})


userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON=function(){
    const user=this
    const userduplicate=user.toObject()
    delete userduplicate.password
    delete userduplicate.tokens
    delete userduplicate.avatar
    return userduplicate
}



//TO LOGIN THE USER..
userSchema.statics.findByEmailAndPassword=async(email,password)=>{
    const user=await User.findOne({email}) 
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch=await bcryptjs.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}


userSchema.pre('save',async function(next){
    const user=this
    
    if(user.isModified('password')){
        user.password=await bcryptjs.hash(user.password,8)
    }
    next()
})


userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

const User=new mongoose.model('User',userSchema)

module.exports=User