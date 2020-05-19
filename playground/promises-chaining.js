require('../src/db/mongoose')
const User=require('../src/models/users')


//BY USING PROMISE METHOD..
// User.find({age:20}).then((users)=>{
//     console.log(users)
// }).catch((e)=>{
//     console.log(e)
// })

//BY USING CALLBACK METHOD..(we can also use toArray()->method)
// User.find({age:20},(error,users)=>{
    // if(error){
    //     return console.log(error)
    // }
    // console.log(users+error)//DRAWBACK WE CAN USE BOTH ERROR and USER TOGETHER
// })


//PROMISE CHAINING ON USERS COLLECTION...
// User.findByIdAndUpdate('5e7f79c0137feb43bac27583',{age:1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:20})
// }).then((count)=>{
//     console.log(count)
// }).catch((e)=>{
//     console.log(e)
// })


const UpdateAgeAndCount= async(id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age})
    const count=await User.countDocuments({age})
    return count
}

UpdateAgeAndCount('5e7f894e10318646988944bf',20).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})