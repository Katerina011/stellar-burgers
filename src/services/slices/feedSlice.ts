import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrdersData } from '@utils-types';

export interface FeedState {
  feedData: TOrdersData;
  status: RequestStatus;
  error: string | null;
}

const initialState: FeedState = {
  feedData: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  status: RequestStatus.Idle,
  error: null
};

export const fetchFeed = createAsyncThunk<TOrdersData, void>(
  'feed/fetchFeed',
  async () => {
    try {
      return await getFeedsApi();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Неизвестная ошибка загрузки ленты заказов';
      throw new Error(message);
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectFeedData: (state: FeedState) => state.feedData,
    selectFeedOrders: (state: FeedState) => state.feedData.orders,
    selectFeedStatus: (state: FeedState) => state.status,
    selectFeedError: (state: FeedState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.feedData = action.payload;
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        if (action.error?.message) {
          state.error = action.error.message;
        } else {
          state.error = 'Неизвестная ошибка загрузки ленты заказов';
        }
      });
  }
});

export const {
  selectFeedData,
  selectFeedOrders,
  selectFeedStatus,
  selectFeedError
} = feedSlice.selectors;

export default feedSlice.reducer;
