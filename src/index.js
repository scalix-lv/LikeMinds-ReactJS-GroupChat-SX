import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import Typicode from 'likeminds-apis-sdk';
import LikeMinds from "likeminds-apis-sdk";
import { initiateSDK } from "./sdkFunctions";

export const myClient = new LikeMinds({
  apiKey: "a6d5aa38-aaa3-4def-95f6-93bb80e1eb24",
  baseUrl: "https://beta.likeminds.community/api",
  xMemberId: "6c3e3024-4cfe-4614-9586-b0dbcad7a2e3",
  xPlatformCode: "web",
  xVersionCode: 16,
});
export const userObj = {
  id: 3555,
  name: "Gaurav",
  updated_at: 1660911399,
  is_guest: false,
  user_unique_id: "6c3e3024-4cfe-4614-9586-b0dbcad7a2e3",
  organisation_name: null,
  image_url: "",
};

myClient
  .getDMFeed({
    community_id: 50414,
  })
  .then((r) => console.log(r))
  .catch((e) => console.log(e));

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
});
