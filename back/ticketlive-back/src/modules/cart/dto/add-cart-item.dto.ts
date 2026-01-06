import { IsInt, Min, IsUUID } from 'class-validator';

export class AddCartItemDto {
  @IsUUID()
  eventId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
