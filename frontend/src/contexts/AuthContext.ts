import { createContext } from "react";
import { AuthContextData } from "./AuthProvider";

export const AuthContext = createContext<AuthContextData | undefined>(undefined)
