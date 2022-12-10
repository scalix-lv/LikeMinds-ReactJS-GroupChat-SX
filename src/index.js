import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Typicode from 'likeminds-apis-sdk';
import LikeMinds from 'likeminds-apis-sdk';
import { initiateSDK } from './sdkFunctions';


export const myClient = new LikeMinds({
  apiKey: "45c469dc-06e1-4f05-914e-dd02419eb53f",
  baseUrl: "https://beta.likeminds.community/api",
  xMemberId: "707a866a-2d28-4b8d-b34b-382ac76c8b85",
  xPlatformCode: "web",
  xVersionCode: 16,
})
export const userObj = {
  "id": 3555,
  "name": "Ankit Garg",
  "updated_at": 1660911399,
  "is_guest": false,
  "user_unique_id": "707a866a-2d28-4b8d-b34b-382ac76c8b85",
  "organisation_name": null,
  "image_url": ""
}

const root = ReactDOM.createRoot(document.getElementById('root'));
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
  setCurrentUser: ()=>{}
})
