const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "9abc31abb099ea",
        pass: "96269816744194"
    }
});

async function sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err)
                console.log("Error Mail")
                reject(false)
            } else {
                console.log("Sent Mail")
                resolve(true)
            }
        })
    })

}

module.exports = sendMail;