import { useNavigate } from "react-router"
import { useGlobalContext } from "../Context"

export default function Header() {
  const navigate = useNavigate()
  const { user, setState } = useGlobalContext()

  const logout = () => {
    setState({ token: "", user: { name: "", email: "" } })
    localStorage.clear()
  }

  if (user.email == "") {
    return (
      <header>
        <h1>Plathanus News</h1>
        <div className="expand"></div>
        <button onClick={() => navigate('/login')}>Entrar</button>
        <button onClick={() => navigate('/register')} className="btn-secondary">Registrar</button>
      </header>
    )
  }

  return (
    <header>
      <h1>Plathanus News</h1>
      <div className="expand"></div>
      <div className="p-box"><p>{user.email}</p></div>
      <button onClick={() => logout()}>Logout</button>
    </header>
  )
}
