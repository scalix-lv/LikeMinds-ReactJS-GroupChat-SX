import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LikeMinds from "likeminds-apis-sdk";
import { initiateSDK } from "./sdkFunctions";

export const myClient = new LikeMinds({
  apiKey: "d4356d31-306e-406d-aa4a-cd49f1b88f19",
  baseUrl: "https://auth.likeminds.community",
  xMemberId: "53208f29-5d15-473e-ab70-5fd77605be0f",
  xPlatformCode: "web",
  xVersionCode: 16,
});
export const communityId = 50421;

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
