const express=require('express')
const multer=require('multer')
const User=require('../models/users')
const auth=require('../middleware/auth')
// const sendWelcomeMail=require('../emails/accounts') NOT WORKING
const router=new express.Router()

//TO CREATE USER..
router.post('/user',async(req,res)=>{
    const user1=new User(req.body);
    // BY USING ASYNC-AWAIT METHOD...
    try{
        const user=await user1.save()
        // sendWelcomeMail() NOT WORKING
        const token=await user.generateAuthToken();
        res.status(201).send({user,token})
    } catch(e){
        res.status(400).send(e)
    }
})


router.post('/user/login',async(req,res)=>{
    try{
        const user=await User.findByEmailAndPassword(req.body.email,req.body.password)
        const token=await user.generateAuthToken();
        res.send({user,token})
    } catch(e){
        res.status(400).send({'error':'Unable to login'})
    }
})


router.post('/user/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send('"Message":"Sucessfully logout."')
    }catch(e){
        res.status(500).send()
    }
})


router.post('/user/logoutAll',auth,(req,res)=>{
    try{
        req.user.tokens=[]
        req.user.save()
        res.status(200).send();
    }catch(e){
        res.status(500).send()
    }
})

//TO GET MY PROFILE..
router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
})


//TO UPDATE THE USER..
router.patch('/user/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','age','email','password']
    const isValidOperator=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperator){
        res.status(400).send('Invalid operation')
    }
    try{
        // const user=await User.findById(req.params.id)
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send(req.user)

    }catch(e){
        res.status(500).send(e)
    } 
})

//TO DELETE THE USER..
router.delete('/user/me',auth,async(req,res)=>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const upload=multer({
    // dest:'avatars',   BECAUSE WE HAVE TO STORE IMAGE IN DATABASE(RATHER THAN IN DIRECTORYS)
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        return cb(new Error('Please upload a image.'))

        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar=req.file.buffer//unable to install sharp
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth, async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async (req,res)=>{
  try{
      const user=await User.findById(req.params.id)

      if(!user || !user.avatar){
          throw new Error()
      }

    //   res.set('Content-type','application/json') BY DEFAULT
      res.set('Content-type','image/jpg')
      res.send(user.avatar)
  }catch(e){
      res.status(400).send()
  }

})

module.exports=router