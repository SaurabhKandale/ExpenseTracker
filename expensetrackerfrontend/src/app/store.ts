import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../Slices/UserSlice";
import { transactionSlice } from "../Slices/TransactionSlice";

export const store = configureStore({
  reducer: {
    userDetails: userSlice.reducer,
    transactions: transactionSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
