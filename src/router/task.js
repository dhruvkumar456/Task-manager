const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()


//TO CREATE TASK...
router.post('/task',auth,async(req,res)=>{
    const task1=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        const task=await task1.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
    // task1.save().then((result)=>{
    //     res.send(result);
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

//GET /tasks?completed=true
//GET /tasks?limit=3&skip=2
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
    const match={}
    const sort={}

    if(req.query.completed)
    match.completed= req.query.completed ==='true'

    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(':')
        sort.createdAt= parts[1] === 'desc'?-1:1
    }

    try{
        await req.user.populate({
            path:'tasks',
            match,
            // match:{
            //     description:'1st task'
            // },it will work
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})


router.get('/task/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const task=await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

//TO UPDATE THE TASKS..
router.patch('/task/:id',auth,async(req,res)=>{
    const allowedUpdates=['completed','description']
    const update=Object.keys(req.body)
    const isValidOperator=update.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperator){
        return res.status(400).send({error:'INVALID OPERATION'})
    }
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})

        if(!task){
            res.status(404).send()
        }

        update.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

//TO DELETE THE TASK..
router.delete('/task/:id',auth,async(req,res)=>{
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        task.remove()
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router