import { ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import axios, { AxiosError } from "axios";

export interface User {
  id: string,
  name: string,
  email: string,
}

export interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: { name: string, email: string; password: string }) => Promise<void>;
}


export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/'
  console.log('VITE_API_URL: ' + BASE_URL)

  const URL_LOGIN = BASE_URL + 'auth/login'
  const URL_VERIFY = BASE_URL + 'auth/verify'
  const URL_REGISTER = BASE_URL + 'auth/register'

  const LOCAL_STORAGE_TOKEN = '@app:token'
  const LOCAL_STORAGE_USER = '@app:user'


  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true); // inicia true enquanto verifica storage
  const navigate = useNavigate()
  const cleanAuth = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_USER)
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    try {
      async function l() {
        const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN)
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER)

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))

          //valida token com api
          const data = await axios.get(URL_VERIFY, { headers: { "Authorization": `Bearer ${storedToken}` } })
          if (data.status != 200) {
            throw new Error('Invalid credentials, please login again.')
          }
        }
      }
      l();
    }

    catch (error) {
      console.error(error)
      cleanAuth()
    }

    finally {
      setLoading(false);
    }
  }, [URL_VERIFY])

  //useCallback para evitar recriações desnecessárias da função
  const signIn = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {

      const data = await axios.post(URL_LOGIN, credentials)
      const apiToken = data.data.token
      const apiUser = data.data.user

      localStorage.setItem(LOCAL_STORAGE_TOKEN, apiToken)
      localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(apiUser))

      setToken(apiToken)
      setUser(apiUser)

    } catch (error) {
      console.error('Falha no login:', error)
      alert("Falha no login: Verifique suas credenciais.")
      cleanAuth()
    } finally {
      setLoading(false)
    }
  }, [URL_LOGIN])

  const signOut = useCallback(() => {
    setLoading(true)
    cleanAuth()
    setLoading(false)
    navigate('/login')
  }, [navigate])

  const signUp = useCallback(async (credentials: { name: string; email: string; password: string }) => {
    setLoading(true)

    try {
      cleanAuth()
      await axios.post(URL_REGISTER, credentials)
      const { email, password } = credentials
      signIn({ email, password })
    }

    catch (error) {
      const e = error as AxiosError
      const j = e.response?.data as { error: string }
      alert(`Falha ao registrar: ${j.error}`)
      console.error(error)
    }

    finally {
      setLoading(false)
    }

  }, [URL_REGISTER, signIn])

  const contextValue: AuthContextData = {
    isAuthenticated: !!token && !!user,
    user,
    token,
    loading,
    signIn,
    signOut,
    signUp,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}


