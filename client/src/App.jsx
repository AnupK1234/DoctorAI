import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import NotFound from "./components/NotFound";
import useHomeLayout from "./hooks/useHomeLayout";
import About from "./pages/About";
import Avatar from "./pages/Avatar";
import Avatar2 from "./pages/Avatar2";
import Contact from "./pages/Contact";
import Document from "./pages/Document";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={useHomeLayout(Home)} />
        <Route path="/contact" element={useHomeLayout(Contact)} />
        <Route path="/login" element={useHomeLayout(Login)} />
        <Route path="/signup" element={useHomeLayout(Signup)} />
        <Route path="/pricing" element={useHomeLayout(Pricing)} />
        <Route path="/about" element={useHomeLayout(About)} />
        <Route path="/avatar2" element={useHomeLayout(Avatar2)} />
        <Route
          path="/upload-doc"
          element={<ProtectedRoute element={useHomeLayout(Document)} />}
        />
        <Route
          path="/avatar"
          element={<ProtectedRoute element={useHomeLayout(Avatar)} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
