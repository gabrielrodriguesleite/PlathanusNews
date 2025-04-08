import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextData } from "./AuthProvider";

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) { // garante que existe um Provider
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context;
}
