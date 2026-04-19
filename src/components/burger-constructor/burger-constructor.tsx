import { FC } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  clearConstructorItems,
  getConstructorItems
} from '../../services/slices/constructorSlice';
import {
  clearOrderModalData,
  createOrder,
  fetchFeedOrders,
  fetchUserOrders,
  getCreateOrderError,
  getOrderModalData,
  getOrderRequest
} from '../../services/slices/ordersSlice';
import { getUser } from '../../services/slices/userSlice';
import { AppRoute } from '@constants/routes';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const createOrderError = useSelector(getCreateOrderError);
  const user = useSelector(getUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate(AppRoute.LOGIN, { state: { from: location } });
      return;
    }

    const ingredientIds = constructorItems.ingredients.map((item) => item._id);
    ingredientIds.unshift(constructorItems.bun._id);
    ingredientIds.push(constructorItems.bun._id);

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructorItems());
        dispatch(fetchFeedOrders());
        dispatch(fetchUserOrders());
      })
      .catch((error) => {
        console.error('Ошибка оформления заказа', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  return (
    <BurgerConstructorUI
      price={constructorItems.price}
      orderRequest={orderRequest}
      createOrderError={createOrderError}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
