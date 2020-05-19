const request=require('supertest')
const app=require('../src/app')
const User=require('../src/models/users')
const {userone,useroneId,setdatabase}=require('./fixtures/db')

beforeEach(setdatabase)



test('Signup a new user',async ()=>{
    const response=await request(app).post('/user').send({
        name:'dhruv',
        email:'something1234@rfgerg.com',
        password:'123456790'
    }).expect(201)


    //check weather data is inserted into mongodb or not
    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // check the data inserted
    expect(response.body).toMatchObject({
        user:{
            name:'dhruv',
            email:'something1234@rfgerg.com'
        },
        token:user.tokens[0].token
    })
})



test('Sign in to existing account',async()=>{
    const response=await request(app).post('/user/login').send({
        email:userone.email,
        password:userone.password
    }).expect(200)

    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        token:user.tokens[1].token
    })

})

test('Sign in to non existing account',async()=>{
    await request(app).post('/user/login').send({
        email:userone.email,
        password:'thisisnotmypassword'
    }).expect(400) 
})

//  NOT WORKING...
test('Read profile of a user',async()=>{
    await request(app)
    .get('users/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send()
    .expect(200)
})


test('Read profile by unathorized user',async()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})


test('Delete user by Unathenticated user',async()=>{
    await request(app)
    .delete('/user/me')
    .send()
    .expect(401)
})


//NOT WORKING
test('Delete user by authenticated user',async()=>{
    await request(app)
    .delete('user/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send()
    .expect(200)
})

//NOT WORKING
test('Should upload avatar image',async ()=>{
    await request(app)
    .post('users/me/avatar')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)
    const user=await User.findById(useroneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

//NOT WORKING
test('Update valid user field',async ()=>{
    await request(app)
    .patch('user/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send({
        name:'dhruv'
    })
    .expect(200)
    const user=await User.findById(useroneId)
    expect(user.name).toBe('dhruv')
})

//NOT WORKING
test('Update invalid user field',async ()=>{
    await request(app)
    .patch('user/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send({
        location:'kuchbhi'
    })
    .expect(400)
})

