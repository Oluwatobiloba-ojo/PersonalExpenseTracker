import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 100 })
    first_name: string
    
    @Column({ type: "varchar", length: 100 })
    last_name: string
    
    @Column({ type: "varchar", length: 100, unique: true, nullable: false })
    email: string;
    
    @Column({ type: "varchar", length: 5000, nullable: false })
    password: string;
    
    @Column({ type: "varchar", length: 11, nullable: true })
    phone_number: string;
    
    @Column({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;
    
    @Column({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Date;
    
    @Column({ type: "boolean", default: false })
    is_active: boolean;

    
    @BeforeInsert()
    setUpUser() {
        this.created_at = new Date();
        this.is_active = true;
    }

    @BeforeUpdate()
    updateUser() {
        this.updated_at = new Date();
    }

}

