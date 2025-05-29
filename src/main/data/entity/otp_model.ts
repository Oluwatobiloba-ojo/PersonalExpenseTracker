import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user_model";

@Entity("otps")
export class OtpModel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    otp: string;

    @Column({ type: "timestamp with time zone"})
    created_at: Date;
    
    @OneToOne( () => User, (user) => user.id, { eager: true})
    user_id: string;

}
