import { Route, Routes } from "react-router";
import { Nav } from "./components/Nav/Nav";
import { Payment } from "./features/Payment/Payment";
import { NotFound } from "./NotFound/NotFound";
import { Register } from "./features/Register/Register";
import { Login } from "./features/Login/Login";
import { FirstPage } from "./features/First-page/FirstPage";
import { Footer } from "./components/Footer/Footer";
import { Income } from "./features/Income/Income";

import "./App.css";
import './Forms.css';

export default function App() {
  return (
    <>
      <div className="app">
        <Nav />

        <main className="content" >
          <Routes>
            <Route path="/" element={<FirstPage />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/income" element={<Income/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  )
}

