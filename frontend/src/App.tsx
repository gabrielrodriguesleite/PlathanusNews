import { Routes, Route } from "react-router"
import Home from "./routes/Home"
import Login from "./routes/Login"
import Register from "./routes/Register"
import { NotFound } from "./routes/NotFound"
import { AuthProvider } from "./contexts/AuthProvider"
import { NewsProvider } from "./contexts/NewsProvider"
import './App.css'

export function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NewsProvider>
    </AuthProvider>
  )
}
