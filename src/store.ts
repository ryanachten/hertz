import { configureStore } from "@reduxjs/toolkit";
import animationReducer from "./reducers/animation.reducer";
import settingsReducer from "./reducers/settings.reducer";

export const store = configureStore({
  reducer: {
    animation: animationReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
