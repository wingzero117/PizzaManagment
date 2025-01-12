import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export default class Topping {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false })
    name!: string;

}