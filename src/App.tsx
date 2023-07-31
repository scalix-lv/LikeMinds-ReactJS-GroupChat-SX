/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState } from 'react';
import './App.css';
import RouteProvider from './modules/components/routes';
import { UserContext } from './modules/contexts/userContext';
import { log } from './sdkFunctions';
import { initiateSDK, retrieveMemberStates } from './sdkFunctions/clientSetup';

function App(props: any) {
  const [currentUser, setCurrentUser] = useState<any>({});
  const [community, setCommunity] = useState();
  const { user } = props;

  useEffect(() => {
    initiateSDK(false, user?.communityId, '')
      .then((res: any) => {
        setCommunity(res?.data?.community);
        setCurrentUser(res?.data?.user);
        sessionStorage.setItem('communityId', res?.data?.community?.id);
      })
      .catch((error: any) => {
        log(error);
      });
  }, []);
  useEffect(() => {
    async function settingMemberState() {
      try {
        if (currentUser?.id === undefined || currentUser.memberRights !== undefined) {
          return null;
        }
        if (currentUser?.memberState !== undefined) {
          return null;
        }
        const res: any = await retrieveMemberStates(currentUser.id);

        let newUserObject = { ...currentUser };

        newUserObject.memberState = res?.data?.member?.state;
        newUserObject.memberRights = res?.data?.member_rights;

        setCurrentUser(newUserObject);
      } catch (error) {
        log(error);
      }
    }
    settingMemberState();
  }, [currentUser]);

  if (currentUser?.id === null || currentUser?.id === undefined) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        community,
        setCommunity
      }}
    >
      <RouteProvider />
    </UserContext.Provider>
  );
}

export default App;
