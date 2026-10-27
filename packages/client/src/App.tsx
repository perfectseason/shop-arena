import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/ui/Footer";
import NavBar from "./components/ui/NavBar";
import About from "./components/pages/About";
import Home from "./components/pages/Home";
import Login from './components/pages/Login';
import ChatBotPage from './components/pages/ChatBot';
import { CartProvider } from './hooks/useCart';





function App() {
  return (
    <BrowserRouter>
      <CartProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <NavBar />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/chatbot" element={<ChatBotPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
