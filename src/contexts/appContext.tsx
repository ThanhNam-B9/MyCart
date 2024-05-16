import { createContext, useState } from 'react'
import { ExtentPurshases } from 'src/pages/Cart/Cart'
import { User } from 'src/types/user.type'
import { getAccessTokenToLS, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  purchasesListOpt: ExtentPurshases[]
  setPurchasesListOpt: React.Dispatch<React.SetStateAction<ExtentPurshases[]>>
  reset: () => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenToLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  purchasesListOpt: [],
  setPurchasesListOpt: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const [purchasesListOpt, setPurchasesListOpt] = useState<ExtentPurshases[]>(initialAppContext.purchasesListOpt)
  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    setPurchasesListOpt([])
  }
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        purchasesListOpt,
        setPurchasesListOpt,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
