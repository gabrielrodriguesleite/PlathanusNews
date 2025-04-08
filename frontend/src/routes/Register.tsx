import { useState } from "react"
import { Navigate, useNavigate } from "react-router"
import { useAuth } from "../contexts/useAuth"

type registerType = {
  name: string
  email: string
  password: string
}

const initialState = { name: "", email: "", password: "" }
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export default function Register() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<registerType>(initialState)
  const disable = credentials.name.length < 3 || !emailRegex.test(credentials.email) || credentials.password.length < 8
  const { signUp, isAuthenticated } = useAuth()


  const register = async () => {
    await signUp(credentials)
  }

  if (isAuthenticated) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="dialog">
      <h1>Registrar</h1>
      <h2>Nome</h2>
      <input type="text" onChange={(event) => {
        setCredentials(state => ({ ...state, name: event.target.value }))
      }} />
      <h2>email</h2>
      <input type="email" onChange={(event) => {
        setCredentials(state => ({ ...state, email: event.target.value }))
      }} />
      <h2>senha</h2>
      <input type="password" onChange={(event) => {

        setCredentials(state => ({ ...state, password: event.target.value }))
      }} />
      <div>
        <button onClick={() => navigate('/login')} className="btn-secondary">Entrar</button>
        <button disabled={disable} title="Preencha seus dados" onClick={register}>Registrar</button>
      </div>
    </div>
  )
}
