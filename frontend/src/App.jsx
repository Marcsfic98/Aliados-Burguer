import Footer from "./components/footer/footer";
import Navbar from "./components/navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function App() {

  return (
    <>
      <Navbar/>
      <main>
        <Outlet/> 
      </main>
      <Footer/>
    </>
  )
}


