import { createContext, useState } from "react";

const UserContext = createContext({
    authStatus: false,
    id: "",
    type: "",
    updateAuthStatus: (authStatus) => {},
    updateUid: (uid) => {},
    updateType: (userType) => {}
});

export function UserContextProvider(props) {
    const [userAuthStatus, setUserAuthStatus] = useState(false);
    const [uid, setUid] = useState("");
    const [userType, setUserType] = useState("");

    function updateAuthStatusHandler(authStatus) {
        setUserAuthStatus(authStatus)
    }

    function updateUidHandler(uid) {
        setUid(uid)
    }

    function updateTypeHandler(userType) {
        setUserType(userType)
    }

    const context = {
        authStatus: userAuthStatus,
        id: uid,
        type: userType,
        updateAuthStatus: updateAuthStatusHandler,
        updateUid: updateUidHandler,
        updateType: updateTypeHandler
    }

    return(
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext;