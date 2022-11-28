import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/header/Header';
import Block from './components/Block/Block';
import Main from './Main';
import DirectMessagesMain from './components/direct-messages/DirectMessagesMain';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main/>,
    children: [
     {
      path: 'forums',
      element: null 
     },
     {
      path: 'groups',
      element: null 
     },
     {
      path: 'events',
      element: null 
     },
     {
      path: 'direct-messages',
      element: <DirectMessagesMain/>
     },
     {
      path: 'added-by-me',
      element: null 
     }
    ]

  }
])


function App() {
  return (
    <div className="App"  >
      <RouterProvider router={router}/>
      {/* <Block/> */}
    </div>
  );
}

export default App;
