import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../contexts/useAuth"
import { Navigate } from "react-router"


const initialState = { email: "", password: "" }
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export default function Login() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState(initialState)
  const disabled = credentials.password.length < 8 || !emailRegex.test(credentials.email)

  const { signIn, isAuthenticated } = useAuth()

  function login() {
    signIn(credentials)
  }

  if (isAuthenticated) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="dialog">
      <h1>Login</h1>
      <h2>email</h2>
      <input type="email" onChange={(event) => {
        setCredentials(state => ({ ...state, email: event.target.value }))
      }} />
      <h2>senha</h2>
      <input type="password" onChange={(event) => {

        setCredentials(state => ({ ...state, password: event.target.value }))
      }} />
      <div>
        <button onClick={login} disabled={disabled}>Entrar</button>
        <button onClick={() => navigate('/register')} className="btn-secondary">Registrar</button>
      </div>
    </div>
  )
}
