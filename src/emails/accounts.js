const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'dhruvkumardk456@gmail.com',
        subject:'Welcome to our App',
        text:`wWelcome ${name}.`
    })
}


module.exports={
    sendWelcomeMail
}