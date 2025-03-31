import axios from "axios"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { useNavigate } from "react-router"
import { useGlobalContext } from "../Context"

type loginType = {
  email: string
  password: string
}

const url = 'http://localhost:3000/auth/login'
const initialState = { email: "", password: "" }
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export default function Login() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState(initialState)
  const disabled = credentials.password.length < 8 || !emailRegex.test(credentials.email)

  const { setState } = useGlobalContext()
  const { isSuccess, error, mutate, data } = useMutation((newLogin: loginType) => axios.post(url, newLogin))
  const login = () => mutate(credentials)

  useEffect(() => {
    if (isSuccess) {
      console.log(data.data.message)
      localStorage.clear()
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(credentials))
      setState({
        token: data.data.token,
        user: {
          name: "",
          email: credentials.email
        }
      })
      navigate('/')
    }
  }, [isSuccess, data, credentials, navigate, setState])

  useEffect(() => {
    if (error) {
      console.error(error)
      alert('Erro ao entrar. Tente novamente mais tarde.')
      navigate('/')
    }
  }, [error, navigate])
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
