import { TConstructorIngredient } from '@utils-types';
import { TNewOrder } from '@api';

export type BurgerConstructorUIProps = {
  constructorItems: {
    price: number;
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  createOrderError: string | null;
  price: number;
  orderModalData: TNewOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
