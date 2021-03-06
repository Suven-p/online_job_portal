import { createContext, useState, useEffect } from 'react';

const UserContext = createContext({
  authStatus: false,
  verifyStatus: false,
  id: '',
  type: '',
  updateUserStatus: ({
    authStatus: newAuthStatus,
    verifyStatus: newVerifyStatus,
    id: uid,
    type: userType,
  }) => {},
});

export function UserContextProvider(props) {
  const [userAuthStatus, setUserAuthStatus] = useState(false);
  const [userVerifyStatus, setUserVerifyStatus] = useState(false);
  const [uid, setUid] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/user');
      const userData = await res.json();
      setUserAuthStatus(userData.success);
      setUid(userData.success ? userData.user.basics.id : '');
      setUserType(userData.success ? userData.user.basics.type : '');
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (userAuthStatus) {
      (async () => {
        const verifyRes = await fetch('/api/verify/status');
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setUserVerifyStatus(verifyData.message ? true : false);
        }
      })();
    }
  }, [userAuthStatus]);

  function updateUserStatusHandler({
    authStatus: newAuthStatus,
    verifyStatus: newVerifyStatus,
    id: uid,
    type: userType,
  }) {
    setUserAuthStatus(newAuthStatus);
    setUserVerifyStatus(newVerifyStatus);
    setUid(uid);
    setUserType(userType);
  }

  const context = {
    authStatus: userAuthStatus,
    verifyStatus: userVerifyStatus,
    id: uid,
    type: userType,
    updateUserStatus: updateUserStatusHandler,
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
