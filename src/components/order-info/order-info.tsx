import { FC, useEffect, useMemo } from 'react';
import { Preloader, OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderById,
  getOrders,
  getOrdersStatus,
  ordersInit
} from '../../services/slices/ordersSlice';
import {
  getIngredientById,
  getIngredients,
  getIngredientsStatus,
  ingredientsInit
} from '../../services/slices/constructorSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const orderNumber = Number(number);

  const dispatch = useDispatch();

  const isLoadingIngredients = useSelector(getIngredientsStatus);
  const isLoadingOrders = useSelector(getOrdersStatus);

  const orders = useSelector(getOrders);
  const ingredients = useSelector(getIngredients);

  const orderData = useSelector((state) =>
    Number.isFinite(orderNumber) ? getOrderById(state, orderNumber) : undefined
  );

  useEffect(() => {
    if (!ingredients.length && !isLoadingIngredients) {
      dispatch(ingredientsInit());
    }

    if (!orders.length && !isLoadingOrders) {
      dispatch(ordersInit());
    }
  }, [dispatch, orders, ingredients, isLoadingIngredients, isLoadingOrders]);

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

  if (!orderInfo || isLoadingIngredients || isLoadingOrders) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
