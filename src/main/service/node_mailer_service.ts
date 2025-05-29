import config from "../config/configuration";
import { EmailService } from "./email_service";
import * as nodemailer from "nodemailer";

export class NodeMailerService implements EmailService {

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        try {
            
            let transporter = nodemailer.createTransport({
                host:config.MAIL_HOST,
                    auth:{
                        user: config.MAIL_USER, 
                        pass: config.MAIL_PASS,
                    }
            }) 
    
            let info = await transporter.sendMail({
                from: config.OWNER_EMAIL,
                to:to,
                subject: subject,
                html: body,
            })
    
            console.log("Info is here: ",info)
        } catch (error) {
            console.log(error.message);
        }
    
    }
};