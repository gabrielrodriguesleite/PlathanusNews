import { useNavigate } from "react-router"

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="dialog">
      <h1>Ops! Essa rota não existe.</h1>
      <h2>Voltar para o inicio?</h2>
      <div>
        <button onClick={() => { navigate('/') }}>Voltar</button>
      </div>
    </div>
  )
}
