import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'





const AUTH_LOCAL_STORAGE_KEY = 'authLog'

const getAuthen = () => {
  if (!localStorage) {
    return
  }

  const lsValue = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth = JSON.parse(lsValue)
    if (auth) {
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuthen = (auth) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuthen = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}


const initAuthContextPropsState = {
  auth: getAuthen(),
  saveAuth: () => { },
  currentUser: undefined,
  setCurrentUser: () => { },
  logout: () => { },
  status: undefined,
  setStatus: () => { },
}


const AuthContext = createContext(initAuthContextPropsState);


const useAuth = () => {
  return useContext(AuthContext)
}



const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getAuthen())
  const [status, setStatus] = useState(false)
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('selectedOption'))

  const saveAuth = (auth) => {
    setAuth(auth);
    if (auth) {
      setAuthen(auth);
      setStatus(true);
    } else {
      removeAuthen()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined);
    setStatus(false)
    removeAuthen();
    localStorage.clear();
  }

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout, status, setStatus }}>
      {children}
    </AuthContext.Provider>
  )
}


export { AuthProvider, useAuth }