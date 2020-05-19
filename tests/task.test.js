const request=require('supertest')
const Task=require('../src/models/task')
const app=require('../src/app')

const {userone,useroneId,setdatabase,usertwo,task1id}=require('./fixtures/db')
beforeEach(setdatabase)



test('create task for user',async()=>{
    const response=await request(app)
    .post('/task')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send({
        description:'first task',
    })
    .expect(201)

    const task=await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})


test('Get all task of userone',async()=>{
    const response=await request(app)
    .get('/tasks')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toBe(3)
})


test('try to delete task of 1st user by second user',async()=>{
    await request(app)
    .delete(`/task/${task1id}`)
    .set('Authorization',`Bearer ${usertwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task1=await Task.findById(task1id)
    expect(task1).not.toBeNull()
})