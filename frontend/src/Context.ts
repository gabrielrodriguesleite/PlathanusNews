import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type contextType = {
  token: string,
  user: {
    name: string,
    email: string,
  },
  setState: Dispatch<SetStateAction<{
    token: string,
    user: {
      name: string,
      email: string,
    }
  }>>
}
export const MyGlobalContext = createContext<contextType>({
  token: "",
  user: {
    name: "",
    email: "",
  },
  setState: () => { },
})

export const useGlobalContext = () => useContext(MyGlobalContext)
