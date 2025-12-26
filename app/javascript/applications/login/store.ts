import { configureStore } from '@reduxjs/toolkit';
import {
  beforeFetch,
  beforeRemote,
  beforeVisit,
  rootReducer,
} from '@thoughtbot/superglue';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { flashSlice } from './slices/flash';

const { pages, superglue, fragments } = rootReducer;

export const store = configureStore({
  // eslint-disable-next-line node/prefer-global/process
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [beforeFetch.type, beforeVisit.type, beforeRemote.type],
      },
    }),
  reducer: {
    superglue,
    pages,
    flash: flashSlice.reducer,
    fragments,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
