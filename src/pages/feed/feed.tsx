import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  getOrdersStatus,
  ordersInit
} from '../../services/slices/ordersSlice';
import {
  getIngredientsStatus,
  ingredientsInit
} from '../../services/slices/constructorSlice';

export const Feed: FC = () => {
  const isLoading = useSelector(getOrdersStatus);
  const isIngredientsLoading = useSelector(getIngredientsStatus);
  const orders = useSelector(getOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ordersInit());
    dispatch(ingredientsInit());
  }, [dispatch]);

  const handleFeedsUpdate = () => {
    dispatch(ordersInit());
  };

  if (isLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleFeedsUpdate} />;
};
