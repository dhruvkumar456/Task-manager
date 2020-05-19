require('../src/db/mongoose')
const Task=require('../src/models/task')


// Task.findByIdAndDelete('5e7f79af137feb43bac27582').then((task)=>{
//     console.log(task)
//     return Task.countDocuments({completed:false})
// }).then((count)=>{
//     console.log(count)
// }).catch((e)=>{
//     console.log(e)
// })


const DeleteByIdAndCount= async(id)=>{
    const task=await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:true})
    return count
}

DeleteByIdAndCount('5e7f8762e7ac4b4591670373').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})