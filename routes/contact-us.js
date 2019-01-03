'use strict';
const nodemailer = require('nodemailer');
const router = require('express').Router();


router.post('/', (req, res) => {
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
        let mailOptions = {
            from: 'durhamredthunder2018@gmail.com',
            to:   'durhamredthunder2018@gmail.com',
            subject: 'Enquiry from Contact Form',
            text:    `
Name:  ${req.body.name}
Email: ${req.body.email}
Telephone: ${req.body.telephone || "not given"}

${req.body.query}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:');
                console.log(error);
                return;
            }
            console.log(`Message sent: ${info.messageId}`);
            console.log(`Preview URL:  ${nodemailer.getTestMessageUrl(info)}`);
        });
    });
    res.redirect('/contact-us');
});


module.exports = router;
