import { useNavigate } from "react-router"
import { useAuth } from "../contexts/useAuth"

export default function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, user, signOut } = useAuth()

  if (!isAuthenticated) {
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
      <div className="p-box"><p>{user?.name}</p></div>
      <button onClick={() => signOut()}>Logout</button>
    </header>
  )
}
