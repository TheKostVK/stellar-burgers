import { FC, useEffect, useMemo } from 'react';
import { Preloader, OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { RootState, useDispatch, useSelector } from '../../services/store';
import {
  fetchFeedOrders,
  fetchUserOrders,
  getFeedOrderById,
  getFeedOrders,
  getFeedStatus,
  getUserOrderById,
  getUserOrders,
  getUserOrdersStatus
} from '../../services/slices/ordersSlice';
import {
  getIngredients,
  getIngredientsStatus,
  ingredientsInit
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
  const isLoadingFeedOrders = useSelector(getFeedStatus);
  const isLoadingUserOrders = useSelector(getUserOrdersStatus);

  const feedOrders = useSelector(getFeedOrders);
  const userOrders = useSelector(getUserOrders);
  const ingredients = useSelector(getIngredients);

  const orderData = useSelector((state: RootState) =>
    Number.isFinite(orderNumber)
      ? isProfileOrder
        ? getUserOrderById(state, orderNumber)
        : getFeedOrderById(state, orderNumber)
      : undefined
  );

  useEffect(() => {
    if (!ingredients.length && !isLoadingIngredients) {
      dispatch(ingredientsInit());
    }

    if (isProfileOrder) {
      if (!userOrders.length && !isLoadingUserOrders) {
        dispatch(fetchUserOrders());
      }
      return;
    }

    if (!feedOrders.length && !isLoadingFeedOrders) {
      dispatch(fetchFeedOrders());
    }
  }, [
    dispatch,
    feedOrders.length,
    userOrders.length,
    ingredients.length,
    isProfileOrder,
    isLoadingIngredients,
    isLoadingFeedOrders,
    isLoadingUserOrders
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

  if (
    !orderInfo ||
    isLoadingIngredients ||
    isLoadingFeedOrders ||
    isLoadingUserOrders
  ) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
