import { FC, useEffect, useMemo } from 'react';
import { Preloader, OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { RootState, useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  getFeedOrderById,
  getOrderByNumber,
  getOrderByNumberError,
  getOrderByNumberRequestedNumber,
  getOrderByNumberStatus,
  getUserOrderById
} from '../../services/slices/ordersSlice';
import {
  getIngredients,
  getIngredientsStatus
} from '../../services/slices/constructorSlice';
import { useLocation, useParams } from 'react-router-dom';
import { AppRoute } from '@constants/routes';

export const OrderInfo: FC = () => {
  const location = useLocation();
  const { number } = useParams();
  const orderNumber = Number(number);
  const isProfileOrder = location.pathname.startsWith(AppRoute.PROFILE_ORDERS);

  const dispatch = useDispatch();

  const isLoadingIngredients = useSelector(getIngredientsStatus);
  const isLoadingOrderByNumber = useSelector(getOrderByNumberStatus);
  const orderByNumberError = useSelector(getOrderByNumberError);

  const ingredients = useSelector(getIngredients);
  const orderByNumber = useSelector(getOrderByNumber);
  const requestedOrderNumber = useSelector(getOrderByNumberRequestedNumber);

  const orderDataFromStore = useSelector((state: RootState) =>
    Number.isFinite(orderNumber)
      ? isProfileOrder
        ? getUserOrderById(state, orderNumber)
        : getFeedOrderById(state, orderNumber)
      : undefined
  );

  const orderData =
    orderDataFromStore ||
    (orderByNumber?.number === orderNumber ? orderByNumber : undefined);

  useEffect(() => {
    if (
      Number.isFinite(orderNumber) &&
      !orderDataFromStore &&
      requestedOrderNumber !== orderNumber &&
      !isLoadingOrderByNumber
    ) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [
    dispatch,
    orderNumber,
    orderDataFromStore,
    requestedOrderNumber,
    isLoadingOrderByNumber
  ]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoadingIngredients || isLoadingOrderByNumber) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <p className='text text_type_main-medium pt-10'>
        {orderByNumberError || 'Заказ не найден'}
      </p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
