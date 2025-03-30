import { useState } from "react"
import { Routes, Route } from "react-router"
import { MyGlobalContext } from "./Context"
import Home from "./routes/Home"
import Login from "./routes/Login"
import Register from "./routes/Register"
import './App.css'

export function App() {
  const [state, setState] = useState({ token: "", user: { name: "", email: "" } })
  return (
    <MyGlobalContext.Provider value={{ ...state, setState }} >
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </MyGlobalContext.Provider>
  )
}
