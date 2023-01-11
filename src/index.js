import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LikeMinds from "likeminds-apis-sdk";

export const myClient = new LikeMinds({
  apiKey: process.env.REACT_APP_API_KEY,
  baseUrl: process.env.REACT_APP_BASE_URL,
  baseUrlCaravan: process.env.REACT_APP_BASE_URL_CARAVAN,
  // xVersionCode: process.env.REACT_APP_X_VERSION_CODE,
  // xMemberId: process.env.REACT_APP_X_MEMBER_ID,
  // xPlatformCode: process.env.REACT_APP_X_PLATFORM_CODE,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export const UserContext = React.createContext({
  currentUser: null,
  setCurrentUser: () => {},
  community: {},
  setCommunity: () => {},
});
