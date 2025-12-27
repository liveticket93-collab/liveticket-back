import 'dotenv/config'; 
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/users.entity'
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderDetail } from 'src/entities/orderDetails.entity';
import { Event } from 'src/modules/event/entities/event.entity';
import { Category } from 'src/modules/categories/entities/category.entity';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  entities: [User, Order, OrderDetail, Event, Category],
  migrations: ['src/migrations/*.ts'], 
  synchronize: false, 
});
