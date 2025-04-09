import { useState } from "react"
import { Routes, Route } from "react-router"
import { MyGlobalContext } from "./Context"
import Home from "./routes/Home"
import Login from "./routes/Login"
import Register from "./routes/Register"
import { NotFound } from "./routes/NotFound"
import { AuthProvider } from "./contexts/AuthProvider"
import './App.css'
import { NewsProvider } from "./contexts/NewsProvider"

export function App() {
  const [state, setState] = useState({ token: "", user: { name: "", email: "" } })
  return (
    <MyGlobalContext.Provider value={{ ...state, setState }} >
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
    </MyGlobalContext.Provider>
  )
}
