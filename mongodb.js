//CURD
// const mongodb=require('mongodb');
// const MongoClient=mongodb.MongoClient;
// const ObjectID=mongo.ObjectID;


//OBJECT DECONSTRUCTING...
const { MongoClient,ObjectID }=require('mongodb');


/*CREATING NEW OBJECT ID..*/
// const id=new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

const connectionUrl='mongodb://127.0.0.1:27017';
const databaseName='task-manager';

MongoClient.connect(connectionUrl, { useNewUrlParser:true}, (error,client)=>{
    if(error){
        return console.log('Unable to connect to Mongodb');
    }
    const db=client.db(databaseName);

    db.collection('task').deleteMany({
        completed:'true',
        // completed:'flase'
    }).then((result)=>{
        console.log(result.deletedCount);
    }).catch((error)=>{
        console.log(error);
    })

    // db.collection('user').deleteMany({
    //     name:'dkd',
    // }).then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error);
    // })

    // db.collection('user').updateMany({
    //     age:19
    // },{
    //     $set:{
    //         name:'dkd',
    //     }
    // }).then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error);
    // })

    // db.collection('user').updateOne({
    //     _id:new ObjectID("5e7b2b42c53be726d9557d94")
    // },{
    //     $inc:{
    //         age:-1
    //     }
    //     // $set:{
    //     //     name:'poshak',
    //     //     age:22
    //     // }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })


    // db.collection('task').findOne({ _id:new ObjectID('5e7b85c26cb38f43fda74f2d') },(error,result)=>{
    //     if(error){
    //         return console.log('Unable to find id..');
    //     }
    //     console.log(result);
    // })

    // db.collection('task').find({ completed:'true'}).toArray((error,tasks)=>{
    //     if(error){
    //         return console.log('ERROR');
    //     }
    //     console.log(tasks);
    // })




    // db.collection('task').findOne({ completed:true },(error,user)=>{
    //     console.log(user);
    // })


    /*THIS IS WHY IT USED CURSOR METHOD..SO THAT WE CAN GET MANY IMFORMATION DEPENDING UPON OUR REQUIREMENTS..
    (FIND ARRAY or COUNT etc..)*/
    // db.collection('user').find({ age:19 }).toArray((error,users)=>{
    //     if(error){
    //         return console.log('Unable to find');
    //     }
    //     console.log(users);
    // })
    // db.collection('user').find({ age:21 }).count((error,count)=>{
    //     if(error){
    //         return console.log('Unable to count');
    //     }
    //     console.log(count);
    // })
    
    // db.collection('user').insertOne({//DOCUMENT..
    //     name:'Dhruv Kumar',
    //     github:'https://www.github.com/dhruvkumar456',
    //     age:19,
    // },(error,result)=>{
    //     if(error){
    //         return console.log('Unable to store data in database');
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('user').insertMany([
    //     {
    //         name:'dhruv',
    //         age:20,
    //     },{
    //         name:'karan',
    //         age:21,
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log('Unable to insert data..!');
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('task').insertMany([
    //     {
    //         description:'first task',
    //         completed:true
    //     },{
    //         description:'second task',
    //         completed:'flase'
    //     },{
    //         description:'third task',
    //         completed:'true'
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log('Unable to insert data in database');
    //     }
    //     console.log(result.ops);
    // })
    // console.log('connect succesfully..');
})