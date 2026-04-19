import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeedOrders,
  getFeedOrders,
  getFeedStatus
} from '../../services/slices/ordersSlice';
import {
  getIngredientsStatus,
  ingredientsInit
} from '../../services/slices/constructorSlice';

export const Feed: FC = () => {
  const isLoading = useSelector(getFeedStatus);
  const isIngredientsLoading = useSelector(getIngredientsStatus);
  const orders = useSelector(getFeedOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    let request = dispatch(fetchFeedOrders());
    dispatch(ingredientsInit());

    const intervalId = setInterval(() => {
      request.abort();
      request = dispatch(fetchFeedOrders());
    }, 30000);

    return () => {
      clearInterval(intervalId);
      request.abort();
    };
  }, [dispatch]);

  const handleFeedsUpdate = () => {
    dispatch(fetchFeedOrders());
  };

  if (isLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleFeedsUpdate} />;
};
