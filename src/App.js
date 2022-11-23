import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/header/Header';
import Block from './components/Groups/Groups';
import Main from './Main';
import Groups from './components/Groups/Groups';
import GroupInfo from './components/groupChatArea/GroupInfo';
import GroupChatArea from './components/groupChatArea/GroupChatArea';
import AcceptInvite from './components/groupChatArea/AcceptInvite';
import PersonInfo from './components/groupChatArea/PersonInfo';

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
      element: <Groups/>,
      children: [
        {
          path: '/groups/main',
          element: <GroupChatArea/>
        },
        {
          path: '/groups/info',
          element: <GroupInfo/>
        },
        {
          path: "/groups/acceptInvite",
          element: <AcceptInvite/>
        },
        {
          path: "/groups/personalInfo",
          element: <PersonInfo/>
        }
      ]
     },
     {
      path: 'events',
      element: null 
     },
     {
      path: 'direct-messages',
      element: null 
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
    <div className="App">
      <RouterProvider router={router}/>
      {/* <Block/> */}
    </div>
  );
}

export default App;
