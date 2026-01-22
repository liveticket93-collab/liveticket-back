import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { Coupon } from "../coupons/entities/coupon.entity";

@Injectable()
export class CartPaymentService {
  private mpClient: MercadoPagoConfig;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>("MP_ACCESS_TOKEN");
    if (!token) throw new Error("MP_ACCESS_TOKEN no definida");

    this.mpClient = new MercadoPagoConfig({ accessToken: token });
  }

  async createPreference(cart: any, coupon?: Coupon | null) {
    if (!cart?.items?.length) {
      throw new BadRequestException("Carrito sin items");
    }

    const rawItems = cart.items.map((item: any) => {
      const unit = Number(item.unitPrice);
      const qty = Number(item.quantity);

      if (!Number.isFinite(unit) || unit < 0) {
        throw new BadRequestException("Precio inválido en carrito");
      }
      if (!Number.isFinite(qty) || qty <= 0) {
        throw new BadRequestException("Cantidad inválida en carrito");
      }

      return {
        title: item.event?.title ?? "Item",
        unit_price: Math.round(unit), // COP entero
        quantity: qty,
        currency_id: "COP",
      };
    });

    const total = rawItems.reduce((sum, it) => sum + it.unit_price * it.quantity, 0);

    let discount = 0;

    if (coupon && coupon.isActive) {
      const value = Number(coupon.value);

      if (coupon.type === "PERCENT") {
        discount = Math.round(total * (value / 100));
      } else if (coupon.type === "FIXED") {
        discount = Math.round(value);
      }
    }

    discount = Math.max(0, Math.min(discount, total));

    const items = rawItems.map((it) => ({ ...it }));

    if (discount > 0 && total > 0) {
      let remainingDiscount = discount;

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const itemTotal = it.unit_price * it.quantity;

        const itemDiscount =
          i === items.length - 1
            ? remainingDiscount
            : Math.round((itemTotal / total) * discount);

        remainingDiscount -= itemDiscount;

        const newItemTotal = Math.max(0, itemTotal - itemDiscount);

        it.unit_price = Math.max(0, Math.round(newItemTotal / it.quantity));
      }
    }

    const preferenceData = {
      items,
      back_urls: {
        success: this.configService.get<string>("MP_SUCCESS_URL")!,
        failure: this.configService.get<string>("MP_FAILURE_URL")!,
        pending: this.configService.get<string>("MP_PENDING_URL")!,
      },
      // auto_return: "approved",
    };

    const preference = await new Preference(this.mpClient).create({
      body: preferenceData,
    });

    return preference.init_point;
  }
}
