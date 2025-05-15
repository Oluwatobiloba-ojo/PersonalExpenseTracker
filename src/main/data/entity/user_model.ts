import { AutoMap } from "@automapper/classes";
import { plainToInstance, Transform } from "class-transformer";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User{
    
    @AutoMap()
    @PrimaryGeneratedColumn("uuid")
    @Transform(({value}) => value.toString().trim())
    id: string;

    @AutoMap()
    @Column({ type: "varchar", length: 100, nullable: false })
    @Transform(({value}) => value.toString().trim())
    first_name: string;
    
    @AutoMap()
    @Column({ type: "varchar", length: 100, nullable: false })
    @Transform(({value}) => value.toString().trim())
    last_name: string;
    
    @AutoMap()
    @Column({ type: "varchar", length: 100, unique: true, nullable: false })
    @Transform(({value}) => value.toString().trim())
    email: string;
    
    @AutoMap()
    @Column({ type: "varchar", length: 5000, nullable: true })
    @Transform(({value}) => value.toString().trim())
    password: string;
    
    @AutoMap()
    @Column({ type: "varchar", length: 11, nullable: true })
    @Transform(({value}) => value.toString().trim())
    phone_number: string;
    
    @AutoMap()
    @Column({type: "timestamp with time zone"})
    created_at: Date;
    
    @AutoMap()
    @Column({type: "timestamp with time zone"})
    updated_at: Date;
    
    @AutoMap()
    @Column({ type: "boolean", default: false })
    is_active: boolean;

    
    @BeforeInsert()
    setUpUser() {
        const user = plainToInstance(User, this);
        this.created_at = new Date();
        this.updated_at = new Date();
        this.is_active = true;
        Object.assign(this, user);
    }

    @BeforeUpdate()
    updateUser() {
        const user = plainToInstance(User, this);
        this.updated_at = new Date();
        Object.assign(this, user);
    }

}



