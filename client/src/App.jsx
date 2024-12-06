import { BrowserRouter, Route, Routes } from "react-router-dom";
import useHomeLayout from "./hooks/useHomeLayout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Signup from "./pages/Signup";
import Document from "./pages/Document";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={useHomeLayout(Home)} />
        <Route path="/contact" element={useHomeLayout(Contact)} />
        <Route path="/login" element={useHomeLayout(Login)} />
        <Route path="/signup" element={useHomeLayout(Signup)} />
        <Route path="/pricing" element={useHomeLayout(Pricing)} />
        <Route path="/upload-doc" element={useHomeLayout(Document)} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
