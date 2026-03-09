import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { RequestStatus, TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeed,
  selectFeedOrders,
  selectFeedStatus
} from 'src/services/slices/feedSlice';
import { useDispatch, useSelector } from 'src/services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const status: RequestStatus = useSelector(selectFeedStatus);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (status === RequestStatus.Loading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
