import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import Topping from "./Topping";

@Entity()
export default class Pizza {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false })
    name!: string;

    @ManyToMany(() => Topping, { cascade: true })
    @JoinTable()
    toppings!: Topping[];
}
