import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Typicode from 'likeminds-apis-sdk';
// const client = new Typicode({
//   apiKey: "8fa4304d-a5b6-4f10-baeb-a80650a480a4"
// })
// client.getChatroom().then(res=>{
//   console.log(res)
// }).catch(e=>{
//   console.log(e)
// })
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
