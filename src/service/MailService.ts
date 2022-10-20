// @ts-nocheck
import { createTransport } from "nodemailer";

class MailService {
    transporter;
    constructor() {
        this.transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(email: string, link: string) {
        await this.transporter.sendMail({
            from: '"WatermelonDispatched Team" <from@example.com>',
            to: email,
            subject: "Активація акаунта " + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Для активації натисність на посилання</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        });
    }
}

export default new MailService();