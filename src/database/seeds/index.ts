//Archivo orquestador
//Decide el orden de ejecución

import { CategorySeed } from "./category.seed";
import { EventSeed } from "./event.seed";
import { OrderSeed } from "./order.seed";
import { OrderDetailSeed } from "./orderDetail.seed";
import { UserSeed } from "./user.seed";

export const seeds = [
  CategorySeed,
  EventSeed,
  UserSeed,
  OrderSeed,
  OrderDetailSeed,
];
