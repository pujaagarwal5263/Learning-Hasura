import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Addtodo from "./components/addTodo";
import React from 'react'

function Router() {
  return (
 
    <Routes>
      <Route path="/" element={<Signup />}/>
      <Route path="login" element={<Login />} />
      <Route path="addtodo" element={<Addtodo />} />
    </Routes>
  
  )
}

export default Router

