import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user_model";
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from "../enum/enum";

@Entity("transactions")
export class Transaction  extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @ManyToOne(() => User, (user) => user.id)
    owner: string;

    @Column({type: "numeric", scale: 2, precision: 10,  nullable: false})
    amount: number;
    
    @Column({type: "enum", enum: TRANSACTION_TYPE})
    transaction_type: string;

    @Column({type: "varchar", length: 5000, nullable: false})
    description: string;

    @Column({type: "enum", enum: TRANSACTION_CATEGORY})
    category: string;

    @Column({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;
    
    @Column({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Date;

    @Column({type: "varchar", length: 100})
    name: string;


    @BeforeInsert()
    setUpTransaction() {
        this.created_at = new Date();
    }

    @BeforeUpdate()
    updateUser() {
        this.updated_at = new Date();
    }
}

