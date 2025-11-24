import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationCode = async (email: string, code: string) => {
    try {
        await transporter.sendMail({
            from: '"Swapi Team" <no-reply@swapi.com>',
            to: email,
            subject: 'Welcome to Swapi! Verify your account',
            html: `
                <h3>Welcome to Swapi!</h3>
                <p>Your verification code is:</p>
                <h1>${code}</h1>
                <p>This code expires in 15 minutes.</p>
            `,
        });
        return true;
    } catch (error) {
        console.error(`[mailer]: Error sending email:`, error);
        return false;
    }
};