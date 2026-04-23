import { Route, Routes } from "react-router";
import { Nav } from "./components/Nav/Nav";
import { NotFound } from "./NotFound/NotFound";
import { Register } from "../src/features/Auth/Register";
import { Login } from "../src/features/Auth/Login";
import { EditUser } from "./features/Auth/EditUser";
import { FirstPage } from "./features/First-page/FirstPage";
import { Income } from "./features/Income/Income";
import { Payment } from "./features/Payment/Payment";
import { Footer } from "./components/Footer/Footer";
import { Report } from "./features/Report/Report"
import { AuthContextProvider } from "../src/features/Auth/context/AuthContextProvider";
import "./App.css";

import { EditFirstPage } from "./features/First-page/EditFirstPage";

export default function App() {
  return (

    <AuthContextProvider>
      <div className="app">
        <Nav />

        <main className="content" >
          <Routes>
            <Route path="/" element={<FirstPage />} />
            <Route path="/report" element={<Report />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/income" element={<Income />} />
            <Route path="/user" element={<EditUser />} />
            <Route path="/editPage" element={<EditFirstPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthContextProvider>

  )
}

