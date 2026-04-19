import { FC } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructorItems,
  getConstructorItems
} from '../../services/slices/constructorSlice';
import {
  clearOrderModalData,
  createOrder,
  getOrderModalData,
  getOrderRequest
} from '../../services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);

  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = constructorItems.ingredients.map((item) => item._id);
    ingredientIds.push(constructorItems.bun._id);

    dispatch(createOrder(ingredientIds));
    dispatch(clearConstructorItems());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  return (
    <BurgerConstructorUI
      price={constructorItems.price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
