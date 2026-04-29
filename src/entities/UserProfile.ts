import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 50, unique: true, nullable: false })
    username!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    firstName!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    lastName!: string;

    @Column({ type: "date", nullable: false })
    birthDate!: Date;

    @Column({ type: "varchar", length: 20, nullable: false })
    gender!: "male" | "female" | "other";

    @Column({ type: "text", nullable: true })
    bio!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    avatar!: string;

    @OneToOne(() => User, (user) => user.profile, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    user!: User;
}
