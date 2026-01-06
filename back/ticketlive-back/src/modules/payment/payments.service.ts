import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class CartPaymentService {
  private mpClient: MercadoPagoConfig;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('MP_ACCESS_TOKEN');
    if (!token) throw new Error('MP_ACCESS_TOKEN no definida');

    this.mpClient = new MercadoPagoConfig({ accessToken: token });
  }

  async createPreference(cart: any) {
    const items = cart.items.map((item) => ({
      title: item.event.title,
      unit_price: Number(item.unitPrice),
      quantity: item.quantity,
      currency_id: 'COP',
    }));

    const preferenceData = {
      items,
      back_urls: {
        success: this.configService.get<string>('MP_SUCCESS_URL')!,
        failure: this.configService.get<string>('MP_FAILURE_URL')!,
        pending: this.configService.get<string>('MP_PENDING_URL')!,
      },
    };

    
    const preference = await new Preference(this.mpClient).create({
      body: preferenceData,
    });

    return preference.init_point;
  }
}