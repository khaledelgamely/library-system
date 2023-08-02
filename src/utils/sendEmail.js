import nodemailer from 'nodemailer';

export const sendEmail = async (email,subject,text,html) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: "gmail",
        auth: {
            user: process.env.senderEmail, // generated ethereal user
            pass:  process.env.senderKey, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Library" <anas.route@gmail.com>`, // sender address
        to: email, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });
}