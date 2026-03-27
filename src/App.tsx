import { Route, Routes } from "react-router";

import { Nav } from "./components/Nav/Nav";
import { Payment } from "./features/Payment/Payment";
import { NotFound } from "./NotFound/NotFound";
import { Register } from "./features/Register/Register";
import { Login } from "./features/Login/Login";

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/payments" element={<Payment/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

