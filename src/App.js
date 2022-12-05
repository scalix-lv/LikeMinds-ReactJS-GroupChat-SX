import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './Main';
import Groups from './components/Groups/Groups';
import GroupInfo from './components/groupChatArea/GroupInfo';
import GroupChatArea from './components/groupChatArea/GroupChatArea';
import AcceptInvite from './components/groupChatArea/AcceptInvite';
import PersonInfo from './components/groupChatArea/PersonInfo';
import { addedByMePath, directMessagePath, eventsPath, forumPath, groupAcceptInvitePath, groupInfoPath, groupMainPath, groupPath, groupPersonalInfoPath, mainPath } from './routes';
import DirectMessagesMain from './components/direct-messages/DirectMessagesMain';
// import DirectMessagesMain from './components/direct-messages/DirectMessagesMain';

const router = createBrowserRouter([
  {
    path: mainPath,
    element: <Main/>,
    children: [
     {
      path: forumPath,
      element: null 
     },
     {
      path: groupPath,
      element: <Groups/>,
      children: [
        {
          path: groupMainPath,
          element: <GroupChatArea/>
        },
        {
          path: groupInfoPath,
          element: <GroupInfo/>
        },
        {
          path: groupAcceptInvitePath,
          element: <AcceptInvite/>
        },
        {
          path: groupPersonalInfoPath,
          element: <PersonInfo/>
        }
      ]
     },
     {
      path: eventsPath,
      element: null 
     },
     {
      path: directMessagePath,
      // element: <DirectMessagesMain/>,
      element: <DirectMessagesMain/>
     },
     {
      path: addedByMePath,
      element: null 
     }
    ]

  }
])


function App() {
  return (
    <div className="App h-full relative">
      <RouterProvider router={router}/>
      {/* <Block/> */}
    </div>
  );
}

export default App;
