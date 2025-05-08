import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user_model";
import { TRANSACTION_CATEGORY } from "../enum/enum";

@Entity("user_daily_summary")
export class UserDailySummary{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.id)
    owner: string;

    @Column({type: "timestamp with time zone"})
    created_at: Date;
    
    @Column({type: "timestamp with time zone"})
    updated_at: Date;

    @Column({type: "bigint"})
    total_spending_count: number;

    @Column({type: "bigint"})
    total_income_count: number;

    @Column({type:"json", nullable : false })
    category_total_count: Map<TRANSACTION_CATEGORY, number>;

    @Column({type: "numeric", scale: 2, precision: 10,  nullable: false})
    total_spending_value: number;

    @Column({type: "numeric", scale: 2, precision: 10, nullable: false})
    total_income_value: number;

    @Column({type:"json", nullable : false })
    category_total_value: Map<TRANSACTION_CATEGORY, number>;

    
    @BeforeInsert()
    setUpTransaction() {
        this.created_at = new Date();
    }

    @BeforeUpdate()
    updateUser() {
        this.updated_at = new Date();
    }
    
}

