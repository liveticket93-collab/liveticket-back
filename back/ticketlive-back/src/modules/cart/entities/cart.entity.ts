import { User } from 'src/modules/users/entities/users.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
    ACTIVE = 'ACTIVE',
    CHECKED_OUT = 'CHECKED_OUT',
    CANCELLED = 'CANCELLED',
}

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.ACTIVE,
    })
    status: CartStatus;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    })
    total: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.carts, { eager: true, onDelete: "CASCADE" })
    user: User;

    @OneToMany(() => CartItem, item => item.cart, {
        cascade: true,
    })
    items: CartItem[];
}
