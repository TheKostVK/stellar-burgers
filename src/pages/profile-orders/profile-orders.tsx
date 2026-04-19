import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  getUserOrders,
  getUserOrdersStatus
} from '../../services/slices/ordersSlice';
import {
  getIngredientsStatus,
  ingredientsInit
} from '../../services/slices/constructorSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getUserOrders);
  const isOrdersLoading = useSelector(getUserOrdersStatus);
  const isIngredientsLoading = useSelector(getIngredientsStatus);

  useEffect(() => {
    let request = dispatch(fetchUserOrders());
    dispatch(ingredientsInit());

    const intervalId = setInterval(() => {
      request.abort();
      request = dispatch(fetchUserOrders());
    }, 60000);

    return () => {
      clearInterval(intervalId);
      request.abort();
    };
  }, [dispatch]);

  return (
    <ProfileOrdersUI
      orders={orders}
      isLoading={isOrdersLoading || isIngredientsLoading}
    />
  );
};
