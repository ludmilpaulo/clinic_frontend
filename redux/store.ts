import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import basketReducer from "./slices/basketSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const isServer = typeof window === "undefined";

// Noop storage for SSR
const noopStorage = {
  getItem(_key: any) {
    return Promise.resolve(null);
  },
  setItem(_key: any, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: any) {
    return Promise.resolve();
  },
};

const rootPersistConfig = {
  key: "root",
  storage: isServer ? noopStorage : storage,
};

const rootReducer = combineReducers({
  basket: basketReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: {
        extraArgument: { storage: isServer ? noopStorage : storage },
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
