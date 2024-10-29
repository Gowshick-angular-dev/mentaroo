import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'


const initAuthContextPropsState = {
  isPageloading: undefined,
  setPageloading: () => { },
}

const PageContext = createContext(initAuthContextPropsState);


const usePage = () => {
  return useContext(PageContext)
}

const PageProvider = ({ children }) => {
  const [isPageloading, setPageloading] = useState(false)

  return (
    <PageContext.Provider value={{ isPageloading, setPageloading }}>
      {children}
    </PageContext.Provider>
  )
}


export { PageProvider, usePage }