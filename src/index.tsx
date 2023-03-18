import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  AudioServiceContext,
  AudioServiceSingleton,
} from "./services/AudioService";
import {
  AudioAnimationContext,
  AudioAnimation,
  StandardAnimation,
  StandardAnimationContext,
} from "./services/AnimationService";
import { store } from "./store";

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StandardAnimationContext.Provider value={StandardAnimation}>
        <AudioAnimationContext.Provider value={AudioAnimation}>
          <AudioServiceContext.Provider value={AudioServiceSingleton}>
            <App />
          </AudioServiceContext.Provider>
        </AudioAnimationContext.Provider>
      </StandardAnimationContext.Provider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
