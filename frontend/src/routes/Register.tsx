import axios from "axios"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { useNavigate } from "react-router"
import { useGlobalContext } from "../Context"

type registerType = {
  name: string
  email: string
  password: string
}

const url = 'http://localhost:3000/auth/register'
const initialState = { name: "", email: "", password: "" }
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export default function Register() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState(initialState)
  const mutation = useMutation((newReg: registerType) => axios.post(url, newReg))
  const register = () => mutation.mutate(credentials)
  const disable = credentials.name.length < 3 || !emailRegex.test(credentials.email) || credentials.password.length < 8
  const { setState } = useGlobalContext()

  useEffect(() => {
    if (mutation.isSuccess) {
      console.log(mutation.data.data.message)
      localStorage.clear()
      localStorage.setItem('token', mutation.data.data.token)
      localStorage.setItem('user', JSON.stringify(credentials))
      setState({ token: mutation.data.data.token, user: credentials })
      navigate('/')
    }
  }, [mutation.isSuccess, mutation.data, credentials, navigate, setState])

  useEffect(() => {
    if (mutation.error) {
      console.error(mutation.error)
      alert('Erro ao registrar. Tente novamente mais tarde.')
      navigate('/')
    }
  }, [mutation.error, navigate])

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
