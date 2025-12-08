import emailjs from '@emailjs/nodejs';

export const sendVerificationCode = async (email: string, code: string) => {
    try {
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID!, 
            process.env.EMAILJS_TEMPLATE_ID!,
            {
                to_email: email,
                code: code
            },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY!,
                privateKey: process.env.EMAILJS_PRIVATE_KEY!,
            }
        );
        console.log(`[mailer]: Correo enviado a ${email}`);
        return true;
    } catch (error) {
        console.error(`[mailer]: Error sending email:`, error);
        return false;
    }
};