import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/ui/Footer";
import NavBar from "./components/ui/NavBar";
import About from "./components/pages/About";
import Home from "./components/pages/Home";






function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-white">
        <NavBar />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
