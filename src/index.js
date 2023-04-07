import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LikeMinds from "likeminds-chat-beta";

export const myClient = new LikeMinds({
  apiKey: "d4356d31-306e-406d-aa4a-cd49f1b88f19",
  // xPlatformCode: process.env.REACT_APP_XPLATFORM_CODE,
  // xVersionCode: process.env.REACT_APP_XVERSION_CODE,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();

export const UserContext = React.createContext({
  currentUser: null,
  setCurrentUser: () => {},
  community: {},
  setCommunity: () => {},
});
